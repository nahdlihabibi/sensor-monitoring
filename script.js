const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'ptik',
  password: 'qwerty123'
});

let lastReceived = Date.now();

client.on('connect', () => {
  document.getElementById('status').textContent = '✅ Terhubung ke Broker, menunggu data...';
  document.getElementById('status').style.color = 'orange';

  client.subscribe('projectgreenhouse');

  // Cek status setiap 3 detik
  setInterval(() => {
    const now = Date.now();
    const diff = now - lastReceived;

    if (diff > 3000) {
      document.getElementById('status').textContent = '❌ Tidak Ada Data Diterima';
      document.getElementById('status').style.color = 'red';

      document.getElementById('suhu').textContent = '0 °C';
      document.getElementById('kelembapan').textContent = '0 %';
      document.getElementById('cahaya').textContent = '0';
      document.getElementById('tanah').textContent = '0';

      document.getElementById('ket-suhu').textContent = 'Menunggu data...';
      document.getElementById('ket-kelembapan').textContent = 'Menunggu data...';
      document.getElementById('ket-cahaya').textContent = 'Menunggu data...';
      document.getElementById('ket-tanah').textContent = 'Menunggu data...';
    }
  }, 1000);
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());

  // Update waktu terakhir data diterima
  lastReceived = Date.now();

  // Tampilkan data
  document.getElementById('suhu').textContent = `${data.suhu} °C`;
  document.getElementById('kelembapan').textContent = `${data.kelembapan} %`;
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;

  // Update status koneksi
  document.getElementById('status').textContent = '✅ Terhubung & Menerima Data';
  document.getElementById('status').style.color = 'green';

  // Interpretasi nilai
  const suhu = parseFloat(data.suhu);
  const kelembapan = parseFloat(data.kelembapan);
  const cahaya = parseInt(data.cahaya);
  const tanah = parseInt(data.tanah);

  // Suhu
  if (suhu < 20) {
    document.getElementById('ket-suhu').textContent = 'Terlalu Dingin';
  } else if (suhu > 30) {
    document.getElementById('ket-suhu').textContent = 'Terlalu Panas';
  } else {
    document.getElementById('ket-suhu').textContent = 'Normal';
  }

  // Kelembapan Udara
  if (kelembapan < 40) {
    document.getElementById('ket-kelembapan').textContent = 'Terlalu Kering';
  } else if (kelembapan > 70) {
    document.getElementById('ket-kelembapan').textContent = 'Terlalu Lembap';
  } else {
    document.getElementById('ket-kelembapan').textContent = 'Normal';
  }

  // Cahaya (semakin tinggi = gelap)
  if (cahaya > 3000) {
    document.getElementById('ket-cahaya').textContent = 'Gelap';
  } else if (cahaya < 1000) {
    document.getElementById('ket-cahaya').textContent = 'Terlalu Terang';
  } else {
    document.getElementById('ket-cahaya').textContent = 'Normal';
  }

  // Kelembapan Tanah
  if (tanah < 1500) {
    document.getElementById('ket-tanah').textContent = 'Terlalu Kering';
  } else if (tanah > 3500) {
    document.getElementById('ket-tanah').textContent = 'Terlalu Basah';
  } else {
    document.getElementById('ket-tanah').textContent = 'Normal';
  }
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
  document.getElementById('status').textContent = '❌ Gagal Terhubung ke Broker';
  document.getElementById('status').style.color = 'red';
});
