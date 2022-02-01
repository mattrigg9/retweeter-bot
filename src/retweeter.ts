import TwitterApi, { TweetV2 } from 'twitter-api-v2';

// Rate throttling for essential-tier Twitter API accounts
const MAX_PAGES = 75;

const twitterClient = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    // Required for app to act on behalf of user.
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
}).v2;

const getNextLikedTweet = async (userId: string, previousTweetId?: string) => {
    const paginatedLikes = await twitterClient.userLikedTweets(userId);

    let nextTweet: TweetV2 | undefined;
    let page = 0;
    while (!paginatedLikes.done) {
        if (paginatedLikes.errors.length) {
            console.error(paginatedLikes.errors);
            throw new Error('Error fetching tweets.');
        }

        page++;
        console.log('Fetching page', page);

        await paginatedLikes.fetchNext();

        if (page >= MAX_PAGES) {
            throw new Error('Aborting search to avoid throttling.');
        }

        if (previousTweetId) {
            const previousTweetIndex = paginatedLikes.tweets.findIndex(
                (tweet) => tweet.id === previousTweetId
            );

            if (previousTweetIndex >= 0) {
                nextTweet = paginatedLikes.tweets.pop();
                break;
            }
        }
    }

    if (!previousTweetId) {
        // If no previous tweet, get last tweet from entire paginated result.
        nextTweet = paginatedLikes.tweets.pop();
    }

    if (!nextTweet) {
        throw new Error('Could not find next tweet');
    }

    return nextTweet.id;
};

export default async () => {
    const user = await twitterClient.me();
    const userId = user.data.id;
    // TODO: Update SSM Parameter store with latest tweet
    const lastTweetId = process.env.LAST_TWEET_ID;
    const tweetId = await getNextLikedTweet(userId, lastTweetId);
    console.log('Retweeting', tweetId);
    twitterClient.retweet(userId, tweetId);
};
