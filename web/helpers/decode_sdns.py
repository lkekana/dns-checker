from dnsstamps import parse, Parameter, Protocol
import dnsstamps.formatter

def decode_dns_stamp(stamp: str) -> Parameter:
    p = parse(stamp)
    dnsstamps.formatter.format(p)
    return p

def main():
    # Example Base64-encoded DNS message (replace with your actual message)
    dns_stamp = "sdns://hQcAAAAAAAAADTQ1LjE1My4xODcuOTYAGG9kb2gtc2UuYWxla2JlcmcubmV0OjQ0MwYvcHJveHk"
    decode_dns_stamp(dns_stamp)

if __name__ == "__main__":
    main()