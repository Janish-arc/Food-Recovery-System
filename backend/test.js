import dns from "dns/promises";

try {
  const result = await dns.resolveSrv("_mongodb._tcp.ecommerce.nvppcsw.mongodb.net");
  console.log(result);
} catch (err) {
  console.error(err);
}