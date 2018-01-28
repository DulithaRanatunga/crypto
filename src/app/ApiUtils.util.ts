export class ApiUtils {
    static applyBuyFee(price, feePc): number {
        return price / this.pcToDecimalMultiplier(feePc);
    }

    static applySellFee(price, feePc): number {
        return price * this.pcToDecimalMultiplier(feePc);
    }

    static pcToDecimalMultiplier(percentage): number {
        return 1 - percentage/100;
    }
}