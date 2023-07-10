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
      document.getElementById("skipDays")!.innerHTML += "<option value='" + this.skipDayValue + "'>" + this.skipDayValue + "</option>";
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
    for (let date of this.dates) {
      let sum: number = +this.generateSums("row" + date.id).toFixed(2);
      if (sum >= 0.99) {
        sum = 1;
      }
      // @ts-ignore
      document.getElementById("sum" + date.id).textContent = sum;
      // @ts-ignore
      document.getElementById("sumSNPS" + date.id).textContent = (sum * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2)
      // @ts-ignore
      document.getElementById("sumFixed" + date.id).textContent = ((sum - this.chosenGlassesInfo.fix) * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
      this.sumGot += +((sum - this.chosenGlassesInfo.fix) * this.chosenGlassesInfo.earning * this.priceMultiplier).toFixed(2);
    }
  }

  changeCurrency() {
    if (this.priceMultiplier === 1) {
      this.priceMultiplier = 0.0095; // parse price SNPS
      this.currency = "USD";
    } else {
      this.priceMultiplier = 1;
      this.currency = "SNPS";
    }
    this.recountTable();
  }
}
