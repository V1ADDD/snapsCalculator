import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface Glasses {
  name: string;
  earning: number;
  unlock: number;
  fix: number;
}

interface DateUnlocks {
  id: number;
  date: string;
  amountToUnlock: number;
  unlockPercent: number;
}

interface GlassesInterface {
  glasses: any;
  start: any;
  end: any;
  skippedDates: string[];
  sumSNPS: number;
  daysCount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'snapsCalculator';
  start: any;
  finish: any;
  skipDayValue: any;
  chosenGlasses: any = "Newbie";
  skipDay: any = "Добавить";
  chosenGlassesInfo: Glasses = {
    name: "",
    earning: 0,
    unlock: 0,
    fix: 0
  };
  glasses: Glasses[];
  dates: DateUnlocks[] = [];
  sumGot: number = 0;
  skippedDatesArray: string[] = [];
  priceMultiplier: number = 1;
  currency: string = "SNPS";
  isWeb3: boolean = false;
  addedGlasses: GlassesInterface[] = [
    {
      glasses: this.chosenGlasses,
      start: undefined,
      end: undefined,
      skippedDates: this.skippedDatesArray,
      sumSNPS: 0,
      daysCount: 0
    }
  ]
  addedGlassesIndex: number = 0;

  constructor(private http: HttpClient) {
    this.glasses = [
      {
        name: "Newbie",
        earning: 400,
        unlock: 0.071,
        fix: 0.57
      },
      {
        name: "Viewer",
        earning: 600,
        unlock: 0.071,
        fix: 0.54
      },
      {
        name: "Follower",
        earning: 1100,
        unlock: 0.077,
        fix: 0.51
      },
      {
        name: "Sub",
        earning: 1550,
        unlock: 0.077,
        fix: 0.48
      },
      {
        name: "Sponsor",
        earning: 3330,
        unlock: 0.1,
        fix: 0.45
      },
      {
        name: "Liker",
        earning: 3800,
        unlock: 1,
        fix: 0.48
      },
      {
        name: "Influencer",
        earning: 3600,
        unlock: 0.111,
        fix: 0.43
      },
      {
        name: "FamousGuy",
        earning: 5100,
        unlock: 0.125,
        fix: 0.4
      },
      {
        name: "Star",
        earning: 6500,
        unlock: 0.142,
        fix: 0.35
      },
      {
        name: "Rockstar",
        earning: 7200,
        unlock: 0.2,
        fix: 0.3
      },
      {
        name: "SuperStar",
        earning: 9000,
        unlock: 0.33,
        fix: 0.25
      },
      {
        name: "Legend",
        earning: 11000,
        unlock: 1,
        fix: 0.15
      }
    ];
  }

  toShortDateString(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  addSkipDay() {
    if (document.getElementById("skipDays")!.innerHTML.includes(this.skipDayValue)) {
      alert("Такая дата уже была добавлена!");
    } else {
      this.skipDay = this.skipDayValue;
      this.skippedDatesArray.push(this.skipDayValue);
      this.recountTable();
    }
  }

  generateDateRange(startDate: Date, endDate: Date) {
    const dates: DateUnlocks[] = [];

    let bigUnlocks: number = 5;
    let iterDatesId: number = 1;

    while (startDate <= endDate) {
      if (bigUnlocks > 0 && this.chosenGlassesInfo.name != "Legend") {
        if (this.skippedDatesArray.includes(this.toShortDateString(startDate))) {
          dates.push(
            {
              id: iterDatesId,
              date: this.toShortDateString(startDate),
              amountToUnlock: 0,
              unlockPercent: 0,
            });
        } else {
          dates.push(
            {
              id: iterDatesId,
              date: this.toShortDateString(startDate),
              amountToUnlock: 1,
              unlockPercent: 0.5,
            });
        }
        bigUnlocks -= 1;
      } else {
        if (this.skippedDatesArray.includes(this.toShortDateString(startDate))) {
          dates.push(
            {
              id: iterDatesId,
              date: this.toShortDateString(startDate),
              amountToUnlock: 0,
              unlockPercent: 0,
            });
        } else {
          dates.push(
            {
              id: iterDatesId,
              date: this.toShortDateString(startDate),
              amountToUnlock: 1,
              unlockPercent: <number>this.chosenGlassesInfo.unlock,
            });
        }
      }
      iterDatesId += 1;
      startDate.setDate(startDate.getDate() + 1);
    }

    this.dates = dates;
  }

  generateSums(className: string): number {
    let sum: number = 0;
    const cellsObjects = document.getElementsByClassName(className);
    for (let i = 0; i < cellsObjects.length; i++) {
      sum += parseFloat(<string>cellsObjects[i].textContent);
    }
    return sum;
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async recountTable() {
    this.chosenGlassesInfo = this.glasses.filter(glass => glass.name == this.chosenGlasses)[0];
    await this.generateDateRange(new Date(this.start), new Date(this.finish));
    await this.delay(200);
    this.sumGot = 0;
    let firstDay: boolean = true;
    for (let date of this.dates) {
      let sum: number = +this.generateSums("row" + date.id).toFixed(2);
      if (sum >= 0.99) {
        sum = 1;
      }
      // @ts-ignore
      document.getElementById("sum" + date.id).textContent = sum;
      // @ts-ignore
      document.getElementById("sumSNPS" + date.id).textContent = (sum * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2)
      if (firstDay) {
        // @ts-ignore
        document.getElementById("sumFixed" + date.id).textContent = (sum * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
        this.sumGot += +(sum * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
        firstDay = false;
      } else {
        // @ts-ignore
        document.getElementById("sumFixed" + date.id).textContent = ((sum - this.chosenGlassesInfo.fix) * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
        this.sumGot += +((sum - this.chosenGlassesInfo.fix) * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
      }
    }
    this.addedGlasses[this.addedGlassesIndex] = {
      glasses: this.chosenGlasses,
      start: this.start,
      end: this.finish,
      skippedDates: this.skippedDatesArray,
      sumSNPS: this.sumGot / this.priceMultiplier,
      daysCount: this.getDiferenceInDays()
    }
  }

  countSumOverall(): number {
    const arraySums: number[] = this.addedGlasses.map(obj => obj.sumSNPS * this.priceMultiplier);
    let result: number = arraySums.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (this.priceMultiplier !== 1 && this.isWeb3) {
      result -= 0.3 * this.getMaxDifferenceInDays();
    }
    return result;
  }

  changeCurrency() {
    if (this.priceMultiplier === 1) {
      const url = "https://www.geckoterminal.com/ru/bsc/pools/0x863e681f97005f5a4c2a1e504f6e4cd0e4d4cca9";

      let responseClone: Response; // 1
      fetch(url)
        .then(function (response) {
          responseClone = response.clone(); // 2
          return response.json();
        })
        .then(function (data) {
        }, (rejectionReason) => { // 3
          responseClone.text() // 5
            .then((bodyText) => {
              const input = bodyText.slice(4300, 4700);
              const startText = 'Цена SNPS/BUSD сегодня — ';
              const endText = ' $';
              const startIndex = input.indexOf(startText);
              const endIndex = input.indexOf(endText);
              const extractedText = input.substring(startIndex + startText.length, endIndex);
              this.priceMultiplier = +extractedText.replace(/,/g, '.');
              this.currency = "USD";
              this.recountTable();
            });
        });
    } else {
      this.priceMultiplier = 1;
      this.currency = "SNPS";
      this.recountTable();
    }
  }

  getDiferenceInDays(): number {
    const result = Math.abs(new Date(this.start).getTime() - new Date(this.finish).getTime()) / (1000 * 60 * 60 * 24);
    if (result)
      return result;
    else
      return 0;
  }

  getMaxDifferenceInDays(): number {
    return Math.max(...this.addedGlasses.map(obj => obj.daysCount));
  }

  switchWeb() {
    this.isWeb3 = !this.isWeb3;
    this.recountTable();
  }

  addGlasses() {
    if (this.start && this.finish && this.glasses) {
      this.start = undefined;
      this.finish = undefined;
      this.skipDayValue = undefined;
      this.chosenGlasses = "Newbie";
      this.skipDay = "Добавить";
      this.chosenGlassesInfo = {
        name: "",
        earning: 0,
        unlock: 0,
        fix: 0
      };
      this.dates = [];
      this.sumGot = 0;
      this.skippedDatesArray = [];
      this.addedGlassesIndex = this.addedGlasses.length;
      this.addedGlasses.push({
        glasses: this.chosenGlasses,
        start: undefined,
        end: undefined,
        skippedDates: this.skippedDatesArray,
        sumSNPS: 0,
        daysCount: this.getDiferenceInDays()
      });
    }
    else {
      alert("Заполните информацию о текущих очках!");
    }
  }

  prevGlasses(){
    if (this.addedGlassesIndex!==0) {
      this.addedGlassesIndex -= 1;
      this.start = this.addedGlasses[this.addedGlassesIndex].start;
      this.finish = this.addedGlasses[this.addedGlassesIndex].end;
      this.skipDayValue = undefined;
      this.chosenGlasses = this.addedGlasses[this.addedGlassesIndex].glasses;
      this.skipDay = "Добавить";
      this.skippedDatesArray = this.addedGlasses[this.addedGlassesIndex].skippedDates;
      this.recountTable();
    }
  }

  nextGlasses(){
    if (this.addedGlassesIndex!==this.addedGlasses.length-1) {
      this.addedGlassesIndex += 1;
      this.start = this.addedGlasses[this.addedGlassesIndex].start;
      this.finish = this.addedGlasses[this.addedGlassesIndex].end;
      this.skipDayValue = undefined;
      this.chosenGlasses = this.addedGlasses[this.addedGlassesIndex].glasses;
      this.skipDay = "Добавить";
      this.skippedDatesArray = this.addedGlasses[this.addedGlassesIndex].skippedDates;
      this.recountTable();
    }
  }
}
