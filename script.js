const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'ptik',
  password: 'qwerty123'
});

let lastReceived = Date.now();
let isConnected = false;

client.on('connect', () => {
  isConnected = true;
  document.getElementById('status').textContent = '✅ Terhubung ke Broker, menunggu data...';
  document.getElementById('status').style.color = 'orange';
  client.subscribe('projectgreenhouse');
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

  // Interpretasi suhu
  if (data.suhu > 35) {
    document.getElementById('info-suhu').textContent = '🔥 Suhu terlalu panas';
  } else if (data.suhu < 20) {
    document.getElementById('info-suhu').textContent = '❄️ Suhu terlalu dingin';
  } else {
    document.getElementById('info-suhu').textContent = '✅ Suhu normal';
  }

  // Interpretasi kelembapan udara
  if (data.kelembapan > 80) {
    document.getElementById('info-kelembapan').textContent = '💧 Udara terlalu lembap';
  } else if (data.kelembapan < 40) {
    document.getElementById('info-kelembapan').textContent = '🌬️ Udara kering';
  } else {
    document.getElementById('info-kelembapan').textContent = '✅ Kelembapan udara normal';
  }

  // Interpretasi cahaya
  if (data.cahaya > 3000) {
    document.getElementById('info-cahaya').textContent = '🌞 Cahaya tinggi';
  } else if (data.cahaya < 1000) {
    document.getElementById('info-cahaya').textContent = '🌑 Cahaya rendah';
  } else {
    document.getElementById('info-cahaya').textContent = '✅ Cahaya cukup';
  }

  // Interpretasi kelembapan tanah
  if (data.tanah > 3000) {
    document.getElementById('info-tanah').textContent = '🌵 Tanah sangat kering';
  } else if (data.tanah < 1500) {
    document.getElementById('info-tanah').textContent = '💦 Tanah sangat basah';
  } else {
    document.getElementById('info-tanah').textContent = '✅ Kelembapan tanah normal';
  }
});

client.on('close', () => {
  isConnected = false;
  document.getElementById('status').textContent = '❌ Terputus dari Broker';
  document.getElementById('status').style.color = 'red';

  document.getElementById('suhu').textContent = '0 °C';
  document.getElementById('kelembapan').textContent = '0 %';
  document.getElementById('cahaya').textContent = '0';
  document.getElementById('tanah').textContent = '0';

  document.getElementById('info-suhu').textContent = 'Tidak ada data';
  document.getElementById('info-kelembapan').textContent = 'Tidak ada data';
  document.getElementById('info-cahaya').textContent = 'Tidak ada data';
  document.getElementById('info-tanah').textContent = 'Tidak ada data';
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
  document.getElementById('status').textContent = '❌ Gagal Terhubung ke Broker';
  document.getElementById('status').style.color = 'red';
});
