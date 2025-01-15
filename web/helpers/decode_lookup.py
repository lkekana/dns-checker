import base64
import dns.message

def decode_from_base64(base64_message):
    # Decode the Base64 message to binary
    binary_message = base64.b64decode(base64_message)
    return binary_message

def parse_dns_message(binary_message):
    # Parse the binary DNS message
    msg = dns.message.from_wire(binary_message)
    return msg

def main():
    # Example Base64-encoded DNS message (replace with your actual message)
    base64_message = "GKmBgAABAAYAAAAAB2V4YW1wbGUDY29tAAABAAHADAABAAEAAABGAARgB4CvwAwAAQABAAAARgAEYAeAxsAMAAEAAQAAAEYABBfXAIrADAABAAEAAABGAAQXwORQwAwAAQABAAAARgAEF8DkVMAMAAEAAQAAAEYABBfXAIg="

    # Decode Base64 message to binary
    binary_message = decode_from_base64(base64_message)

    # Parse the binary DNS message
    dns_message = parse_dns_message(binary_message)

    # Print the DNS message
    print(f"Decoded DNS Message:\n{dns_message}")

if __name__ == "__main__":
    main()
