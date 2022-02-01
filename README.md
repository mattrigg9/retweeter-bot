# Likes Retweeter

This simple Twitter bot retweets a user's liked tweets in chronological order, once every hour. AWS Lambda hosts the bot, and AWS SAM manages the deployment, which executes the job on a simple hourly cron-job.

# Environment Variables

The following environment variables must be populated in the Lambda execution context. You can find them in the Twitter Developer Portal [here](https://developer.twitter.com/en/portal/dashboard).

**Note**: Retweeting functionality requires OAuth 1.0a authentication and Read/Write authorization for your developer app. 

- `APP_KEY` (String): Your project's app key
- `APP_SECRET`:  (String): Your project's app secret
- `ACCESS_TOKEN`: (String): The access token enables the application to act on behalf of your user. Note: This credential set requires Read/Write functionality.
- `ACCESS_SECRET`: (String): The access secret that enables the application to act on behalf of your user. Note: This credential set requires Read/Write functionality.

# SSM Parameter Store

This bot uses the SSM Parameter Store to persist the last tweet ID retweeted under the environment variable, `LAST_TWEET_ID` (String).