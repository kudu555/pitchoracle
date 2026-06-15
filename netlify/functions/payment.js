exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body);

    console.log('API Key present:', !!process.env.NOWPAYMENTS_API_KEY);
    console.log('Request body:', JSON.stringify(body));

    const res = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOWPAYMENTS_API_KEY
      },
      body: JSON.stringify({
        price_amount: body.price_amount,
        price_currency: body.price_currency || 'usd',
        pay_currency: body.pay_currency || 'usdtbsc',
        order_description: body.order_description || 'PitchOracle Access',
        success_url: 'https://pitchoracle.uk/pro',
        cancel_url: 'https://pitchoracle.uk'
      })
    });

    const data = await res.json();
    console.log('NOWPayments response:', JSON.stringify(data));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
