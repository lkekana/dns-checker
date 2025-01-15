import dns.query
import dns.message
import ssl
import argparse
from typing import List, Dict, Any
import dns.rdatatype
import dns.rdataclass
import json
import base64

def query_dns_over_tls(query_name, tls_server='1.1.1.1', tls_port=853) -> dns.message.Message:
    """
    Perform DNS lookup over TLS.
    :param query_name: The domain name to query (e.g., 'example.com').
    :param tls_server: The DNS server to use for DoT (default: 1.1.1.1 for Cloudflare).
    :param tls_port: The port to use (default: 853 for DoT).
    :return: The DNS response message.
    """
    # Build a DNS query message
    query = dns.message.make_query(query_name, dns.rdatatype.A)

    # Set up TLS context
    context = ssl.create_default_context()
    context.check_hostname = False

    # Send the query over TLS
    response = dns.query.tls(query, tls_server, port=tls_port, ssl_context=context)
    return response

def main():
    parser = argparse.ArgumentParser(description='Perform DNS lookup over TLS.')
    parser.add_argument('--domain', '-d', required=True, help='The domain name to query (e.g., example.com).')
    parser.add_argument('--server', '-s', default='1.1.1.1', help='The DNS server to use for DoT (default: 1.1.1.1 for Cloudflare).')
    parser.add_argument('--port', '-p', default=853, type=int, help='The port to use (default: 853 for DoT).')
    args = parser.parse_args()
    response = query_dns_over_tls(args.domain, args.server)
    # print(response)
    print(base64.b64encode(response.to_wire()).decode('utf-8'))

if __name__ == '__main__':
    main()
