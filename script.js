const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'syafri',
  password: 'qwerty123'
});

client.on('connect', () => {
  document.getElementById('status').textContent = 'Terhubung';
  document.getElementById('status').style.color = 'green';
  client.subscribe('projectgreenhouse');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  document.getElementById('suhu').textContent = data.suhu;
  document.getElementById('kelembapan').textContent = data.kelembapan;
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
});
