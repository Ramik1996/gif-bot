const botConnect = require('workonflow-bot-client').connect;
const request = require('superagent');
const creds = require('./creds');
const apiKey = 'rSpyajGeavnESVWZQmVtN2ZlLz6ftFg5';

(async () => {
  const botClient = await botConnect(creds);
  const { comment } = botClient;
  comment.onDirect(async(message) => {
    try {
      const { teamId, data: { content: { streamId, att: [{ data: { text } }] }, userId } } = message;

      if (!text) {
        await comment.create(teamId, {
          att: [{ type: 'text', data: { text: `@${userId}@ I'm sorry, I don't understand. Could you please try again?` } }],
          streamId,
          to: [userId],
        });
        return;
      }

      const giphyUrl = await getGiphy(text);
      if (!giphyUrl) {
        console.log('no url found');
        await comment.create(teamId, {
          att: [{ type: 'text', data: { text: `@${userId}@ Sorry, I didn't find anything.` } }],
          streamId,
          to: [userId],
        });
        return;
      }

      await comment.create(teamId, {
        att: [{ type: 'text', data: { text: giphyUrl } }],
        to: userId
      });
    } catch (err) {
      console.log('[ERROR]', err);
    }

  });
  comment.onMention(async (message) => {
    try {
      const { teamId, data: { content: { streamId, att: [{ data: { text } }] }, userId } } = message;

      if (!text) {
        await comment.create(teamId, {
          att: [{ type: 'text', data: { text: `@${userId}@ I'm sorry, I don't understand. Could you please try again?` } }],
          streamId,
          to: [userId],
        });
        return;
      }

      const giphyUrl = await getGiphy(text);
      if (!giphyUrl) {
        console.log('no url found');
        await comment.create(teamId, {
          att: [{ type: 'text', data: { text: `@${userId}@ Sorry, I didn't find anything.` } }],
          streamId,
          to: [userId],
        });
        return;
      }

      await comment.create(teamId, {
        att: [{ type: 'text', data: { text: giphyUrl } }],
        streamId,
      });
    } catch (err) {
      console.log('[ERROR]', err);
    }
  });

})();
async function getGiphy(tag) {
  return request
    .get('api.giphy.com/v1/gifs/random')
    .query({ api_key: apiKey, tag})
    .then((res) => {
      return res.body.data['url'];
    }); 
}
