# Student Daily Performance Tracking System

Frontend-only dashboard built with **React (Vite) + Tailwind CSS + React Router + Recharts + lucide-react**, in an ocean / glassmorphism theme. No backend: data is seeded from mock students and saved in `localStorage`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Pages

| Route | Page | What it does |
| --- | --- | --- |
| `/` | Dashboard | 4 stat cards + weekly class performance line chart |
| `/students` | Student List | Search by name / roll no, filter by department, click a row to open, delete a student |
| `/students/:id` | Student Detail | Profile header, 7-day marks line graph, attendance calendar, recent records (deletable) |
| `/add` | Add Performance | Form (name, date, subject, marks, attendance) saved to localStorage; typing a new name creates a new student |

## Folder structure

```
src/
  components/   Navbar, WaveBackground, GlassCard, StatCard, AttendanceCalendar
  pages/        Dashboard, StudentList, StudentDetail, AddPerformance
  data/         students.js (mock data), helpers.js (stats + dates), StudentContext.jsx (localStorage store)
```

## Notes

- Mock records are generated for the last 30 days relative to today, so charts always have data. Three students have no entry for today, which is what the "Pending Reviews" card counts.
- Absent days store no marks and are ignored in average-marks calculations.
- Use **Reset demo data** on the Students page to restore the original data (also refreshes the dates).
- Data is stored under the localStorage key `sdpts_students_v1`.
