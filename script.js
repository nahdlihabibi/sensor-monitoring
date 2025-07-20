const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'syafri',
  password: 'qwerty123'
});

let lastReceived = 0;

client.on('connect', () => {
  document.getElementById('status').textContent = '🟠 Terhubung ke Broker, menunggu data...';
  document.getElementById('status').style.color = 'orange';

  client.subscribe('projectgreenhouse');

  setInterval(() => {
    const now = Date.now();
    if (lastReceived && (now - lastReceived > 3000)) {
      document.getElementById('status').textContent = '❌ Tidak Ada Data Diterima';
      document.getElementById('status').style.color = 'red';

      document.getElementById('suhu').textContent = '0 °C';
      document.getElementById('kelembapan').textContent = '0 %';
      document.getElementById('cahaya').textContent = '0';
      document.getElementById('tanah').textContent = '0';

      document.getElementById('ket-suhu').textContent = '-';
      document.getElementById('ket-kelembapan').textContent = '-';
      document.getElementById('ket-cahaya').textContent = '-';
      document.getElementById('ket-tanah').textContent = '-';
    }
  }, 1000);
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());

  document.getElementById('suhu').textContent = `${data.suhu} °C`;
  document.getElementById('kelembapan').textContent = `${data.kelembapan} %`;
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;

  document.getElementById('status').textContent = '✅ Terhubung & Menerima Data';
  document.getElementById('status').style.color = 'green';

  lastReceived = Date.now();

  // Keterangan suhu
  const suhu = parseFloat(data.suhu);
  document.getElementById('ket-suhu').textContent =
    suhu < 20 ? 'Terlalu Dingin' : suhu > 30 ? 'Terlalu Panas' : 'Normal';

  // Keterangan kelembapan
  const kelembapan = parseFloat(data.kelembapan);
  document.getElementById('ket-kelembapan').textContent =
    kelembapan < 40 ? 'Kering' : kelembapan > 70 ? 'Lembap' : 'Normal';

  // Cahaya
  const cahaya = parseInt(data.cahaya);
  document.getElementById('ket-cahaya').textContent =
    cahaya < 1000 ? 'Gelap' : cahaya > 3000 ? 'Terlalu Terang' : 'Normal';

  // Tanah
  const tanah = parseInt(data.tanah);
  document.getElementById('ket-tanah').textContent =
    tanah < 1500 ? 'Basah' : tanah > 3500 ? 'Kering' : 'Normal';
});

client.on('error', () => {
  document.getElementById('status').textContent = '❌ Tidak Terhubung ke Broker';
  document.getElementById('status').style.color = 'red';
});
