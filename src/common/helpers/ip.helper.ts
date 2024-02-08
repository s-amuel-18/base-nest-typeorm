import axios from 'axios';

export class IpHelper {
  static async geIpInfo(ip: string) {
    try {
      const { data } = await axios.get(`https://ipinfo.io/${ip}/json`);
      return data;
    } catch (error) {
      return null;
    }
  }
}
