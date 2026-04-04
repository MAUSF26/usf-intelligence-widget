exports.handler = async function(event, context) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = 'Daily Intelligence';
  try {
    // Fetch recent records sorted by date descending
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?maxRecords=30&sort[0][field]=Date&sort[0][direction]=desc`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    // Filter to only the most recent date's records
    if (data.records && data.records.length > 0) {
      var latestDate = null;
      for (var i = 0; i < data.records.length; i++) {
        var d = data.records[i].fields.Date;
        if (d) { latestDate = d; break; }
      }
      if (latestDate) {
        data.records = data.records.filter(function(r) {
          return r.fields.Date === latestDate;
        });
      }
    }

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
