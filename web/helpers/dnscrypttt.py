import dns.query
# import dnscrypt
from dnscrypt import Resolver
import dns.message
import ssl
import argparse
from typing import List, Dict, Any
import dns.rdatatype
import dns.rdataclass
import json
import base64
from dnsstamps import parse, Parameter, Protocol
import dnsstamps.formatter

def decode_dns_stamp(stamp: str) -> Parameter:
    p = parse(stamp)
    dnsstamps.formatter.format(p)
    return p

def query_dns_over_dnscrypt(query_name, sdns_stamp, port):
    """
    Perform a DNS lookup over DNSCrypt.

    :param query_name: The domain name to query (e.g., 'example.com').
    :param sdns_stamp: The DNSCrypt stamp to use (e.g., 'sdns://AQYAAAAAAAAADjkxLjIwNS4yMzAuMjI0IDEzcq1ZVjLCQWuHLwmPhRvduWUoTGy-mk8ZCWQw26laHjIuZG5zY3J5cHQtY2VydC5jcnlwdG9zdG9ybS5pcw').
    :param port: The port to use (usually 443, 53, or 5353 for DNSCrypt).
    :return: The DNS response message.
    :raises ValueError: If the provided DNSCrypt stamp is invalid.
    """
    server = decode_dns_stamp(sdns_stamp)
    if server.protocol != Protocol.DNSCRYPT:
        raise ValueError("Invalid DNSCrypt stamp.")

    # Build a DNS query message
    query = dns.message.make_query(query_name, dns.rdatatype.A)

    # Send the query over DNSCrypt
    r = Resolver(server.address,server.provider_name,server.public_key.decode('ascii'), port=port)
    response = r.udp(query)
    return response

def main():
    parser = argparse.ArgumentParser(description='Perform DNS lookup over DNSCrypt.')
    parser.add_argument('--domain', '-d', required=True, help='The domain name to query (e.g., example.com).')
    parser.add_argument('--stamp', '-s', required=True, help='The DNSCrypt stamp to use (e.g., sdns://AQYAAAAAAAAAD...).')
    parser.add_argument('--port', '-p', required=True, type=int, help='The port to use (usually 443, 53 or 5353 for DNSCrypt).')
    args = parser.parse_args()
    # response = query_dns_over_dnscrypt("example.com","sdns://AQYAAAAAAAAADjkxLjIwNS4yMzAuMjI0IDEzcq1ZVjLCQWuHLwmPhRvduWUoTGy-mk8ZCWQw26laHjIuZG5zY3J5cHQtY2VydC5jcnlwdG9zdG9ybS5pcw",443)
    response = query_dns_over_dnscrypt(args.domain, args.stamp, args.port)
    print(base64.b64encode(response.to_wire()).decode('utf-8'))

if __name__ == '__main__':
    main()