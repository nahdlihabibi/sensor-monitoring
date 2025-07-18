const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'syafri',
  password: 'qwerty123'
});

let lastReceived = Date.now();

client.on('connect', () => {
  document.getElementById('status').textContent = '✅ Terhubung ke Broker, menunggu data...';
  document.getElementById('status').style.color = 'orange';

  client.subscribe('projectgreenhouse');

  // Cek status setiap 5 detik
  setInterval(() => {
    const now = Date.now();
    const diff = now - lastReceived;

    if (diff > 10000) {
      document.getElementById('status').textContent = '❌ Tidak Ada Data dari Device';
      document.getElementById('status').style.color = 'red';

      // Kosongkan data
      document.getElementById('suhu').textContent = '0 °C';
      document.getElementById('kelembapan').textContent = '0 %';
      document.getElementById('cahaya').textContent = '0';
      document.getElementById('tanah').textContent = '0';
    }
  }, 5000);
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());

  document.getElementById('suhu').textContent = `${data.suhu} °C`;
  document.getElementById('kelembapan').textContent = `${data.kelembapan} %`;
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;

  // Update status koneksi & waktu terakhir terima data
  lastReceived = Date.now();
  document.getElementById('status').textContent = '✅ Terhubung & Menerima Data';
  document.getElementById('status').style.color = 'green';
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
  document.getElementById('status').textContent = '❌ Gagal Terhubung ke Broker';
  document.getElementById('status').style.color = 'red';
});
