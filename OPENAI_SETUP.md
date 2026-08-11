# OpenAI API Setup Guide

This guide will help you configure your Supabase Edge Functions to use your own OpenAI API instead of the Lovable AI gateway.

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-`)
5. **Important**: Save it immediately - you won't be able to see it again!

## Step 2: Set Up Environment Variables in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add the following secrets:

### Required Secrets:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Optional Secrets (with defaults):
```env
OPENAI_MODEL=gpt-4o-mini
OPENAI_VISION_MODEL=gpt-4o
```

**Available OpenAI Models:**
- `gpt-4o` - Most capable, supports vision (used for PDF images)
- `gpt-4o-mini` - Fast and cost-effective (recommended default for text)
- `gpt-4-turbo` - High quality, good balance
- `gpt-3.5-turbo` - Fastest and cheapest (no vision support)

**Note**: The `pdf-chat` function automatically uses the vision model (`gpt-4o` by default) when PDF images are present, otherwise it uses the regular model.

## Step 3: Deploy Updated Functions

All Edge Functions have been updated to use OpenAI. Deploy them:

```powershell
# Deploy all updated functions
npx supabase functions deploy ai-tutor
npx supabase functions deploy pdf-chat
npx supabase functions deploy generate-quiz
npx supabase functions deploy generate-flashcards
```

## Step 4: Test the Integration

1. Go to your app and try the AI Tutor
2. Upload a PDF and test the PDF chat
3. Generate a quiz
4. Generate flashcards

## What Changed

### Updated Functions:
- ✅ `ai-tutor` - Now uses OpenAI for chat completions with improved error handling
- ✅ `pdf-chat` - Now uses OpenAI for PDF analysis, automatically switches to vision model for images
- ✅ `generate-quiz` - Now uses OpenAI with function calling, improved error messages
- ✅ `generate-flashcards` - Now uses OpenAI with function calling, improved error messages

### Client-Side Fixes:
- ✅ `QuizUploader` - Now properly extracts text from PDFs before sending to API
- ✅ All functions now show detailed error messages from OpenAI API
- ✅ Better handling of API errors (401, 402, 429 status codes)

### API Endpoint:
- **Old**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **New**: `https://api.openai.com/v1/chat/completions`

### Environment Variables:
- **Old**: `LOVABLE_API_KEY`
- **New**: `OPENAI_API_KEY` (required) and `OPENAI_MODEL` (optional)

## Cost Considerations

OpenAI pricing (as of 2024):
- **gpt-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **gpt-4o**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens
- **gpt-3.5-turbo**: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens

**Recommendation**: Start with `gpt-4o-mini` for cost-effectiveness. It's fast and provides good quality for educational content.

## Troubleshooting

### Error: "OPENAI_API_KEY is not configured"
- Make sure you added the secret in Supabase Dashboard
- Redeploy the function after adding the secret

### Error: "Invalid API key"
- Check that your API key starts with `sk-`
- Verify the key is active in OpenAI dashboard
- Make sure there are no extra spaces when copying

### Error: "Rate limit exceeded"
- You've hit OpenAI's rate limits
- Check your usage at https://platform.openai.com/usage
- Consider upgrading your OpenAI plan or using a different model

### Function calls not working
- Make sure you're using a model that supports function calling (gpt-4o, gpt-4o-mini, gpt-4-turbo, or gpt-3.5-turbo)
- Check function logs in Supabase Dashboard
- Verify the content being sent is valid text (not base64)

### Quiz/Flashcard generation fails
- Ensure PDFs contain extractable text (not just images)
- Check that the document is not corrupted
- Verify the extracted text is not empty (check browser console)

### PDF chat with images not working
- Make sure `OPENAI_VISION_MODEL` is set to a vision-capable model (`gpt-4o` or `gpt-4-turbo`)
- Vision models are more expensive - consider if you really need image analysis

## Monitoring Usage

1. Go to https://platform.openai.com/usage
2. Monitor your API usage and costs
3. Set up usage limits in OpenAI dashboard to prevent unexpected charges

## Security Best Practices

1. **Never commit API keys to git** - They're stored as Supabase secrets
2. **Use environment-specific keys** - Different keys for dev/prod
3. **Set usage limits** - Configure spending limits in OpenAI dashboard
4. **Rotate keys regularly** - Update keys periodically for security

