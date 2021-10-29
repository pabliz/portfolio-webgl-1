export default class SwapSpan {
    constructor() {


        this.swapText = document.querySelector("#swap");
        this.awesome = "awesome";
        this.fun = "fun!  ;-)";
        this.beautiful = "beautiful";
        this.amazing = "amazing";
        this.words = [this.awesome, this.fun, this.beautiful, this.amazing];
        this.timer = (ms) => new Promise((res) => setTimeout(res, ms));
        this.swap();
    }
    async swap() {
        if (this.swapText) {
            for (let i = 0; i < this.words.length; i++) {
                this.swapText.textContent = this.words[i];
                await this.timer(5000); // then the created Promise can be awaited
                if (i === 1) {
                    this.swapText.classList.toggle("red");
                }
                if (i === 2) {
                    this.swapText.classList.toggle("yellow");
                }
                if (i === 3) {
                    this.swap();
                }
            }
        }
    }
}