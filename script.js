const client = mqtt.connect('wss://rmq.corex.id:8084/mqtt', {
  username: 'ptik',
  password: 'qwerty123'
});

let isConnected = false;

client.on('connect', () => {
  isConnected = true;
  updateStatus();
  client.subscribe('projectgreenhouse');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  document.getElementById('suhu').textContent = data.suhu + " °C";
  document.getElementById('kelembapan').textContent = data.kelembapan + " %";
  document.getElementById('cahaya').textContent = data.cahaya;
  document.getElementById('tanah').textContent = data.tanah;
});

client.on('error', () => {
  isConnected = false;
  updateStatus();
});

function updateStatus() {
  const status = document.getElementById('status');
  if (isConnected) {
    status.textContent = "Terhubung";
    status.style.color = "green";
  } else {
    status.textContent = "Belum Terhubung";
    status.style.color = "red";
  }
}
