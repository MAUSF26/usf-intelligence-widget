exports.handler = async function(event, context) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = 'Daily Intelligence';

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?maxRecords=7&sort[0][field]=Date&sort[0][direction]=desc`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
