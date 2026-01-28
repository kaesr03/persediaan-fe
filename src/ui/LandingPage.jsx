import { Link } from 'react-router-dom';
import { Boxes, ClipboardList, ShieldCheck } from 'lucide-react';

import logo from '../assets/logoD.png';

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow">
      <div className="rounded-xl bg-indigo-50 p-2">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide text-slate-800">
          <img src={logo} alt="" className="mb-1 inline w-8 bg-transparent" />
          <span>
            asa <span className="text-indigo-600"> Jaya</span> Motor
          </span>
        </h1>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl leading-tight font-bold text-slate-800 md:text-5xl">
              Manage Inventory <br />
              <span className="text-indigo-600">Smarter & Faster</span>
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Aplikasi Web Persediaan Barang Bengkel Dasa Jaya Motor membantu
              pengelolaan persediaan suku cadang, pencatatan barang masuk dan
              keluar, serta pemantauan ketersediaan stok untuk mendukung
              kegiatan operasional bengkel.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white shadow transition hover:bg-indigo-700"
              >
                Mulai
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <Feature
              icon={<Boxes className="h-6 w-6 text-indigo-600" />}
              title="Stock Management"
              desc="Pantau jumlah stok barang secara akurat dan real-time."
            />
            <Feature
              icon={<ClipboardList className="h-6 w-6 text-indigo-600" />}
              title="Easy Tracking"
              desc="Catat pengeluaran dan pemasukan dengan cepat."
            />
            <Feature
              icon={<ShieldCheck className="h-6 w-6 text-indigo-600" />}
              title="Secure & Reliable"
              desc="Data inventory aman dan terstruktur dengan baik."
            />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500">
        &copy; 2026 Dasa Jaya Motor. All rights reserved.
      </footer>
    </div>
  );
}
