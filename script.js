const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'ptik',
  password: 'qwerty123'
});

let lastMessageTime = null;

client.on('connect', () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = '✅ Terhubung ke Broker, menunggu data...';
  statusDiv.classList.add('connected');
  client.subscribe('projectgreenhouse');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  document.getElementById('suhu').textContent = data.suhu;
  document.getElementById('kelembapan').textContent = data.kelembapan;
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;

  lastMessageTime = Date.now();
  updateStatus(true);
});

// Cek apakah data terus masuk atau tidak
setInterval(() => {
  if (lastMessageTime) {
    const elapsed = Date.now() - lastMessageTime;
    if (elapsed > 6000) { // jika lebih dari 6 detik tidak ada data
      updateStatus(false);
    }
  }
}, 3000);

function updateStatus(terhubung) {
  const statusDiv = document.getElementById('status');
  if (terhubung) {
    statusDiv.textContent = '✅ Terhubung & Menerima Data';
    statusDiv.classList.add('connected');
  } else {
    statusDiv.textContent = '❌ Tidak Ada Data Diterima';
    statusDiv.classList.remove('connected');
  }
}

client.on('error', (err) => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = '❌ Gagal Terhubung ke Broker';
  statusDiv.classList.remove('connected');
});
