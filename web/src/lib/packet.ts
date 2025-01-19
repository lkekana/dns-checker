import * as dnsPacket from 'dns-packet';

// Function to encode a DNS query to Base64 URL-safe format
export function createDnsBody(domain: string): string {
    // Create a DNS query for the given domain (A record)
    const query = dnsPacket.encode({
        type: 'query',
        id: Math.floor(Math.random() * 65535),  // Random ID
        questions: [{
            name: domain,
            type: 'A'
        }]
    } as dnsPacket.Packet);

    // Encode the binary query to Base64 (URL-safe)
    const base64Query = Buffer.from(query).toString('base64');

    // Make it URL-safe (replace + and / with URL-safe characters, remove padding)
    const urlSafeQuery = base64Query.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeQuery;
}

export function createQueryURL(server: string, domain: string): string {
    const encodedQuery = createDnsBody(domain);
    const url = `${server}?dns=${encodedQuery}`;
    return url;
}

export function decodeB64Packet(encodedPacket: string): dnsPacket.DecodedPacket {
    // Decode the Base64-encoded packet
    const base64Packet = encodedPacket.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64Packet, 'base64');
    const packet = dnsPacket.decode(buffer);
    return packet;
}