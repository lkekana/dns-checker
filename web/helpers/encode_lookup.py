import base64
import dns.message
import dns.query
import dns.rdatatype

domain = 'example.com'


def create_dns_query(domain, qtype=dns.rdatatype.A):
    # Create a DNS query message for the provided domain and query type
    msg = dns.message.make_query(domain, qtype)
    # Convert the DNS message to binary format
    binary_message = msg.to_wire()
    return binary_message

def encode_to_base64(binary_message):
    # Encode the binary message to Base64
    base64_message = base64.b64encode(binary_message).decode('utf-8')
    return base64_message

def main():
    # Define the domain and query type
    qtype = dns.rdatatype.A  # Query type 'A' for IPv4 addresses

    # Create DNS query message
    binary_message = create_dns_query(domain, qtype)

    # Encode binary message to Base64
    base64_message = encode_to_base64(binary_message)

    # Print the Base64-encoded message
    print(f"Base64 Encoded DNS Message:\n{base64_message}")

if __name__ == "__main__":
    main()
