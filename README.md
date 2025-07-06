# Bluprint.IO

**Bluprint.IO** is a web application for organizing, annotating, and interacting with blueprints and technical drawings — all online, from any device.

---

## 📌 What is this?

When working with physical blueprints in the field — whether in construction, engineering, or maintenance — it can be hard to carry large paper plans, find specs, or mark up details on the fly.  
**Bluprint.IO** solves this by letting you **upload your blueprint, mark it up with interactive pins, and store all related specs, photos, and notes — accessible from anywhere.**

---

## 🚀 Core features

✅ Upload blueprint files or take a photo on-site  
✅ Drag & drop **pins** onto blueprint images  
✅ Attach specs, images, notes, or torque data to each pin  
✅ Save all blueprint info securely to your account (login system)  
✅ Hosted in the cloud with **ASP.NET Core** + **Azure SQL**  
✅ Modern responsive UI for mobile & desktop

---

## 🧩 Tech stack

- **ASP.NET Core MVC** (C#)
- **Entity Framework Core**
- **Azure SQL Database**
- **Azure App Service** (for deployment)
- **GitHub Actions** (CI/CD pipeline)
- **HTML, CSS, JS** (frontend interactivity)

---

## ⚙️ How to run it locally

1. Clone the repo

    ```bash
    git clone https://github.com/Merced3/Bluprint.IO.git
    cd Bluprint.IO
    ```

2. Install .NET SDK if needed: [Download .NET](https://dotnet.microsoft.com/en-us/download)

3. Run the app:

    ```bash
    dotnet run
    ```

4. Open your browser to `https://localhost:XXXX` (or the URL shown in your terminal)

---

## 🔐 Security & configuration

- The `appsettings.json` is excluded from this repo to keep connection strings and secrets safe.
- When running locally, use your own connection string for the database.

---

## 💡 Why I built this

**Bluprint.IO** was born from a simple need: paper blueprints are bulky, easy to damage, and hard to manage when you’re in a crawlspace, on a lift, or halfway through a teardown.

This tool makes blueprints digital and interactive — so builders, engineers, and tinkerers can:

- **Mark up** exactly where specs, torque values, or parts info go.
- **Attach photos** and detailed notes that stay connected to the right spot.
- **Access plans** anywhere — phone, tablet, or laptop — no more flipping through rolls of paper.
- **Collaborate** with teammates by sharing clear, clickable info instead of messy scribbles.

Over time, Bluprint.IO could grow into a **digital vault** for any project:

- DIY car builds
- Off-grid cabin layouts
- Heavy equipment maintenance
- Custom fabrication or 3D printing

At its core, it’s about turning one static blueprint into a living guide — keeping all the hidden details right where you need them, forever.

---

## 🧑‍💻 Author

**Merced Gonzales III**
[LinkedIn](https://www.linkedin.com/in/merced/) • [GitHub](https://github.com/Merced3)

---

## 📜 License

MIT — free for personal and educational use.
