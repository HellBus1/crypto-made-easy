# Crypto Made Easy — Personal Spot Trading Rules & Gate.com Step-by-Step Playbook

> **Educational Risk Notice:** This playbook is an educational checklist and risk-management framework, **not financial, investment, or trading advice**. Crypto prices cannot be predicted with certainty. Even when every rule aligns, a trade can hit its stop-loss. Never trade with borrowed money, leverage, or funds needed for rent, food, or debt.

---

## Part 1: Why Simple "Downtrend = Buy" Fails (Unlearning the Trap)

Before looking at a single chart, burn this myth:

- **Myth:** *"If it's downtrending, buy cheap; otherwise take profit."*
- **Why that loses money:**
  1. Buying simply because candles are red is **catching a falling knife**. In a real crash, price can drop below `MA30` and stay oversold (`RSI <= 36`) for days while sellers dump through every level.
  2. Selling immediately simply because price isn't dropping cuts winning trades short while full losses still hit your stop-loss—creating tiny wins and big losses.

**What the 3-Light System actually is:**  
It is **not** a price predictor. It is a disciplined filter that asks:
1. Is the coin currently resting on a proven **price floor (support)** in an uptrend or sideways range (not a free-fall crash)?
2. Are **all 3 Safety Lights** aligned on `4H` or `1D`?
3. Before clicking Buy, do you know your exact **split-entry sizes**, **untouched cash reserve**, and **automatic exit price**?

---

## Part 2: Your 1-Page Personal Trading Rules Sheet

*(Tailored for starting capital under `$50 USDT`, spot-only trading on Gate.com, and checking the market calmly a few times per day.)*

### 1. Capital, Security & Exchange Setup Rules
- **Tuition Cap:** Start with **`$20–$50 USDT`** total in your **Spot** account. Treat this first chapter as tuition, not monthly income.
- **Zero Leverage:** Trade **Spot only** (`Buy` with cash you already own). Never touch Futures, Margin, or borrowed funds.
- **Account Security First:** Enable authenticator **2FA**, turn on withdrawal address whitelisting, and ignore all unsolicited DMs/links.
- **Exchange Fee & Minimum Reality (Gate.com):**
  - Standard spot fees shown on Gate.com are **Maker `0.2%` / Taker `0.2%`** (`~0.4%` round trip on a buy + sell).
  - Gate.com minimum order size is **`>= 1 USDT`** per order (`Total >= 1 USDT`).
  - Always use **Limit Orders** (not Market Orders) so you control your exact fill price and avoid wide spreads.

### 2. Your Split-Entry Capital Ladder (`13% / 21% / 30% / 36%`)

Never spend 100% of your budget on the first click. Divide your capital into four buckets:

| Bucket | Default Share | On `$50.00 USDT` Starter Budget | On `$233.77 USDT` Reference Example | Where It Goes on Gate.com |
|---|---|---|---|---|
| **Entry 1 (Test Buy)** | `~13%` (`12.83%`) | **`$6.42 USDT`** *(~`$6.50`)* | **`$30.00 USDT`** | Limit Buy at **Support Floor 1** |
| **Entry 2 (Deeper Dip)** | `~21%` (`21.39%`) | **`$10.70 USDT`** *(~`$10.50`)* | **`$50.00 USDT`** | Resting Limit Buy at **Support Floor 2** |
| **Entry 3 (Deepest Floor)** | `~30%` (`29.94%`) | **`$14.97 USDT`** *(~`$15.00`)* | **`$70.00 USDT`** | Resting Limit Buy at **Support Floor 3** |
| **Safe Cash Reserve** | `~36%` (`35.84%`) | **`$17.91 USDT`** *(~`$18.00`)* | **`$83.77 USDT`** | **Stays untouched in USDT wallet** |

*Notice: Even on a small `$50` budget, Entry 1 (`$6.42`) is well above Gate's `1 USDT` minimum order, and after Entry 1 fills you still hold **87% of your budget in USDT cash**.*  
*(Note: If you test with only `$20 USDT`, Entry 1 is `$2.57`, still safely above `$1`.)*

### 3. Two Mandatory Pre-Buy Filters (Market Context + 3 Lights)

Before placing **any** buy order on an altcoin (like SOL or ETH), pass **both** gates:

#### Gate A: Market-Wide & Structure Check *(Fixes the BTC Dump Trap)*
1. Check **BTC/USDT on `1D` / `4H`** first:
   - **Rule:** If BTC is down **more than `-5%` in 24 hours** OR actively breaking below its own `4H/1D` support floor, **skip all new altcoin buy entries for the day**—even if the altcoin turns all 3 lights green.
2. Check the **coin's own `1D` / `4H` structure**:
   - **Trade only** pullbacks inside an **uptrend** or **sideways range near proven support** (previous bounce zones).
   - **Stay out** of multi-day waterfall crashes making lower `4H` highs and lower lows with shrinking buyer bids.

#### Gate B: The 3 Traffic Lights Checklist (`/checker`)
Switch Gate.com to **`4h`** or **`1D`** (never `1m` or `15m`) and require **all 3 lights ON simultaneously**:
- **Light 1 — Coin on Discount:** Current Price `< MA30` **or** Current Price `<= Bollinger Lower Band (LB)`.
- **Light 2 — Sellers Tired:** `RSI (14) <= 36`.
- **Light 3 — Real Buyers Waiting Below:** `Order Book Green Bid % >= 40%` (`Ask % <= 60%`). *(Beware spoofed walls that flash and vanish within seconds.)*

### 4. Stop-Loss & Execution Rules *(Fixes Freezing at the Stop)*
- **Stop-Loss Formula:** Set your pre-agreed **Stop-Loss** at **`2%` below your lowest Support Floor** (`Lowest Support × 0.98`).
- **Automatic Protection (No Guessing):** Immediately after Entry 1 fills on Gate.com, set an **automatic Conditional / TP-SL Stop order** at your Stop-Loss price.
- **No Moving the Goalposts:** You may *never* move the stop-loss lower during a dip, and you may *never* deploy your 36% cash reserve to rescue a broken floor.
- **Take-Profit Rule:** Take profit calmly via a **Limit Sell** at your **Resistance Ceiling** (or `+8%` fallback if no resistance is clear), or when **holding** and **2+ sell warning lights trigger** (`Price > MA30` / `BOLL UB`, `RSI > 70`, `Bid % < 30%`).

### 5. Screen-Time Discipline
- `4H` bars close every 4 hours; `1D` bars close once per day.
- Check charts at **2 fixed times per day max** (10 minutes each). Do not watch `1m` or `5m` candles between sessions.

---

## Part 3: Step-by-Step Gate.com Walkthrough (Exact Workflow)

1. **Open the Spot Tab:** Select e.g. `SOL/USDT` on **Spot** (not Futures).
2. **Filter Out Noise:** At the top-left of the chart, click **`4h`** (or **`1D`**). Ignore `1m`, `5m`, `15m`.
3. **Enable Only the 4 Essentials:** Along the bottom indicator strip, keep only **`MA`**, **`BOLL`**, **`Volume`**, and **`RSI`** (via `>` arrow). Leave the other 13 buttons OFF.
4. **Check BTC Context First:** Glance at `BTC/USDT` 24h change and `4h/1D` chart. Is BTC calm (`> -5%`) and holding structure?
   - If NO -> **Close the app and Wait.**
   - If YES -> Continue to Step 5.
5. **Read the 5 Chart Numbers + Levels:**
   - Top-left price header: **Current Price** & **`MA30`** (and **`BOLL LB / UB`** if shown).
   - Bottom sub-chart: **`RSI(14)`** value (`0–100`).
   - Middle Order Book bar: **Green Buyers `Bid %`**.
   - Look left on the `4H` chart to note **1 to 3 Support Floors** (where red drops previously left long bottom wicks and bounced) and **1 to 2 Resistance Ceilings** (where green rallies previously stalled).
6. **Enter Numbers in `/checker`:**
   - Check the **Decision Badge**: Only proceed with new buys if **`Buy Zone` (3/3 Lights ON)** *and* BTC/Structure context has no crash caution.
7. **Place Orders on the Right-Hand Ticket (Only When `Buy Zone`):**
   - Switch to the **Buy -> Limit** tab.
   - Set Price = **Support Floor 1** (or right near current price if sitting on Floor 1), Budget = **Entry 1 (~13%)**. Click **Buy**.
   - Immediately after Entry 1 fills (or in the **TP/SL** box), place your **Stop-Loss** at the `-2% below Floor 3` price.
   - Optionally place resting **Limit Buy** orders for **Entry 2 (~21%) at Floor 2** and **Entry 3 (~30%) at Floor 3** so dips work for you automatically.
   - Leave your **36% Reserve** untouched in USDT.
8. **Log the Check & Walk Away:** Record the check in `/journal`, close Gate.com until your next scheduled session.

---

## Part 4: 5 Complete Real-World Worked Examples

*(All BTC/ETH/SOL price levels from 5–6 November 2026 are historical worked examples from the project source documentation, scaled for both `$50 USDT` beginner budgets and the `$233.77 USDT` reference budget.)*

### Example 1: SOL/USDT (`4H`) — `BUY ZONE` (All 3 Lights ON + Calm BTC)
- **Context:** BTC 24h change is `-1.4%` (calm). SOL pulled back inside an established range toward proven bounce floors.
- **Chart Readings:**
  - Current Price = **`$89.73`** | `MA30` = **`$91.60`** (`BOLL LB = $88.90`) -> **Light 1 ON** *(below MA30, discounted)*
  - `RSI` = **`36.0`** -> **Light 2 ON** *(sellers running out of steam)*
  - Order Book `Bid %` = **`40.61%`** (`Ask % = 59.39%`) -> **Light 3 ON** *(buyer wall underneath)*
  - Support Floors: **`$88.50`** / **`$85.00`** / **`$81.20`** | Resistance Ceiling: **`$95.00`**
  - Pre-Agreed Stop-Loss: `$81.20 × 0.98` = **`$79.58`**
- **Action Plan on a `$50 USDT` Starter Budget:**
  1. Place Limit Buy **Entry 1** at `$88.50` for **`$6.42 USDT`** (~`0.0725 SOL`). You still hold **87% (`$43.58`)** in USDT!
  2. Attach **TP/SL Stop-Loss** at **`$79.58`**.
  3. Place resting Limit Buys: **Entry 2** at `$85.00` (`$10.70 USDT`) and **Entry 3** at `$81.20` (`$14.97 USDT`).
  4. Keep **`$17.91 USDT` (36%)** untouched in your wallet.
  5. Set Limit Sell **Take-Profit** target at **`$95.00`** (`+7.34%` from Entry 1; even after `~0.4%` round-trip fees, net ~`+6.9%`).
- **Action Plan on `$233.77 USDT` Reference Budget:** Exact tranches = **`$30.00 / $50.00 / $70.00`**, Reserve = **`$83.77 USDT`**, Stop = **`$79.58`**.

---

### Example 2: ETH/USDT (`4H`) — `WAIT` (Saved from Catching a Falling Knife)
- **Chart Readings:**
  - Current Price = **`$2,420`** | `MA30` = **`$2,490`** -> **Light 1 ON** *(looks "cheap")*
  - `RSI` = **`34.0`** -> **Light 2 ON** *(looks oversold)*
  - Order Book `Bid %` = **`22%`** (`Ask % = 78%`) -> **Light 3 OFF** *(sellers dominate 3.5-to-1!)*
  - MACD red bars growing + higher selling volume.
- **Result (`WAIT`):** Because **Light 3 is OFF**, `/checker` refuses to trigger `Buy Zone` and explains: *"Sellers still dominate the order book."*
- **What You Do:** **Nothing.** Keep 100% of your `$50` in USDT. Buying purely because price dropped below MA30 would have walked straight into aggressive sellers.

---

### Example 3: SOL Shows 3/3 Green Lights During a `-7.0%` BTC Crash — `CONTEXT OVERRIDE (WAIT)`
- **Chart Readings:**
  - SOL happens to read `Price $89.73 < MA30 $91.60`, `RSI 35`, `Bid 41%` (**3/3 green lights**).
  - **HOWEVER:** You check `BTC/USDT` first and see BTC dropped **`-7.0%` in 24 hours** and broke its 4H support floor.
- **What You Do (Market Context Rule):**
  - Enter `-7` in the **BTC 24h %** context field on `/checker`. A prominent **Market-Wide Drop Caution** warns you not to open new altcoin entries while BTC is actively crashing.
  - **Skip buying.** Wait for BTC to stabilize (stop printing lower `4H` lows), then re-check whether SOL still has real buyers (`Bid >= 40%`).

---

### Example 4: Holding SOL Near Resistance Ceiling — `TAKE PROFIT / SELL`
- **Situation:** You already entered SOL near `$88.50` (`Holding = ON`, Avg Buy `$88.50`). Over the next 3 days, SOL rallies to **`$96.20`**.
- **Chart Readings:**
  - Price **`$96.20`** > `MA30 $91.60` & above **`BOLL UB $95.80`** -> **Sell Light 1 Active**
  - `RSI` = **`74`** (`> 70`, buyers overheated) -> **Sell Light 2 Active**
  - Order Book `Bid %` = **`25%`** (`< 30%`, thin buyer support below) -> **Sell Light 3 Active**
  - Price has also cleared your **`$95.00`** Resistance Ceiling.
- **Result (`TAKE PROFIT`):** Place a **Limit Sell** near `$95.00–$96.20` (`~+8.7%` gross from `$88.50`) rather than getting greedy and hoping it doubles overnight.

---

### Example 5: Floor Cracks Below Stop-Loss — `PLAN BROKEN` (Calm Exit)
- **Situation:** You bought SOL (`Avg Buy $85.00`) with Lowest Support Floor at `$81.20` and Stop-Loss pre-set at **`$79.58`**. Surprise bad news drags SOL down to **`$79.50`**.
- **Result (`PLAN BROKEN`):**
  - Because `Current Price ($79.50) <= Stop-Loss ($79.58)`, your bounce premise no longer holds.
  - Your pre-placed **Gate.com TP/SL Stop** triggers cleanly. On a `$50` account (say Entry 1 + Entry 2 filled = `$17.12` risked), your realized loss is roughly **`~$1.09 USDT` (~`2%` of total `$50` capital)**, while **`$32.88`–`$18.00` cash stays safe**.
  - **What NOT to do:** Never cancel the stop hoping it bounces back, never deploy your 36% reserve (`$18`) into the broken floor, and never revenge-trade immediately afterward.

---

## Part 5: Your 2-Week / 10-Check Paper-Trade Graduation Plan

Before putting real `$20–$50` into Gate.com orders:
1. Open **`/journal`** (the Paper-Trade Journal page in Crypto Made Easy).
2. Perform **10 real chart checks** over 2 weeks during your 2 scheduled daily windows (`4H` / `1D`).
3. Log every check—including **waits** (e.g., ETH `22% Bid` or BTC `-6%` crash) and **hypothetical stops/targets** checked 48 hours later.
4. **Graduation Gate:** Once you reach **10 / 10 Rule-Compliant Paper Checks** without moving a virtual stop-loss or chasing FOMO, place **one real Entry 1 Limit Buy** (`~13%`, e.g., `$6.50` on a `$50` budget) with an immediate automatic TP/SL Stop-Loss attached.

