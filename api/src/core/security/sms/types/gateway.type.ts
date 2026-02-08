import { CarrierType } from "./carrier.type";
import { DomainType } from "./domain.type";

export const gatewayMap: Record<CarrierType, DomainType> = {
    verizon: "@vtext.com",
    att: "@txt.att.net",           // DISCONTINUED June 2025
    tmobile: "@tmomail.net",
    usCellular: "@email.uscc.net",
    googleFi: "@msg.fi.google.com",
    cricket: "@mms.cricketwireless.net", // DISCONTINUED June 2025
    boost: "@myboostmobile.com"
};