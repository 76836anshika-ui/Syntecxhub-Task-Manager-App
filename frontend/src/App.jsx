import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownUp, CalendarDays, Check, CheckCircle2, ChevronDown, Circle, Clock3, LayoutDashboard, ListTodo, LogOut, Plus, Search, Sparkles, Target, Trash2, X, Pencil, AlertCircle } from "lucide-react";
import api from "./api";

const blank = { title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" };
const initials = (name = "You") => name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
const niceDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No due date";

export default function App() {
  const [auth, setAuth] = useState(() => ({ token: localStorage.getItem("taskflow_token"), user: JSON.parse(localStorage.getItem("taskflow_user") || "null") }));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All tasks");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const loadTasks = async () => {
    if (!localStorage.getItem("taskflow_token")) return;
    setLoading(true);
    try { const { data } = await api.get("/tasks"); setTasks(data); setError(""); }
    catch (e) { setError(e.response?.data?.message || "Could not connect to the API. Is the backend running?"); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (auth.token) loadTasks(); }, [auth.token]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    progress: tasks.filter(t => t.status === "In Progress").length,
    pending: tasks.filter(t => t.status === "Pending").length
  }), [tasks]);

  const visible = useMemo(() => {
    let list = tasks.filter(t => {
      const matchesFilter = filter === "All tasks" || (filter === "Today" ? t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() : t.status === filter);
      const matchesQuery = `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
    return list.sort((a, b) => sort === "oldest" ? new Date(a.createdAt) - new Date(b.createdAt) : sort === "due" ? new Date(a.dueDate || "2999-01-01") - new Date(b.dueDate || "2999-01-01") : new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks, filter, query, sort]);

  const submitAuth = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post(`/auth/${authMode}`, authForm);
      localStorage.setItem("taskflow_token", data.token); localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      setAuth({ token: data.token, user: data.user }); setNotice(authMode === "login" ? "Welcome back!" : "Your account is ready!"); 
    } catch (e) { setError(e.response?.data?.message || "Could not connect. Start the backend and check MongoDB settings."); }
    finally { setLoading(false); }
  };

  const logout = () => { localStorage.removeItem("taskflow_token"); localStorage.removeItem("taskflow_user"); setAuth({ token: null, user: null }); setTasks([]); setError(""); };
  const openNew = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = (task) => { setEditing(task._id); setForm({ title: task.title, description: task.description || "", dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "", priority: task.priority, status: task.status }); setModal(true); };
  const saveTask = async (e) => {
    e.preventDefault(); setError("");
    try {
      if (editing) await api.patch(`/tasks/${editing}`, form);
      else await api.post("/tasks", form);
      setModal(false); setNotice(editing ? "Task updated" : "Task created"); await loadTasks();
    } catch (e) { setError(e.response?.data?.message || "Could not save task."); }
  };
  const changeStatus = async (task) => {
    const next = task.status === "Pending" ? "In Progress" : task.status === "In Progress" ? "Completed" : "Pending";
    try { await api.patch(`/tasks/${task._id}`, { status: next }); await loadTasks(); }
    catch (e) { setError(e.response?.data?.message || "Could not update task."); }
  };
  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await api.delete(`/tasks/${task._id}`); setTasks(old => old.filter(t => t._id !== task._id)); setNotice("Task deleted"); }
    catch (e) { setError(e.response?.data?.message || "Could not delete task."); }
  };

  if (!auth.token) return <div className="auth-page"><div className="auth-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="brand"><span className="brand-icon"><ListTodo size={21}/></span> taskflow<span className="brand-dot">.</span></div><div className="auth-copy"><span className="eyebrow"><Sparkles size={15}/> YOUR DAY, IN FLOW</span><h1>Make space for<br/><em>great work.</em></h1><p>A calmer way to plan your day, track your progress, and turn intentions into done.</p><div className="mini-card"><div className="mini-check"><Check size={17}/></div><div><strong>Launch the new website</strong><small>Project milestone · Today</small></div><span className="mini-tag">Done</span></div><div className="auth-foot">FOCUS ON WHAT MATTERS <span>✳</span></div></div></div><div className="auth-panel"><div className="mobile-brand"><span className="brand-icon"><ListTodo size={21}/></span> taskflow<span className="brand-dot">.</span></div><div className="auth-box"><div className="auth-kicker">WELCOME {authMode === "login" ? "BACK" : "ABOARD"}</div><h2>{authMode === "login" ? "Sign in to TaskFlow" : "Create your account"}</h2><p className="muted">{authMode === "login" ? "Your next productive day starts here." : "A few details, then you're ready to go."}</p><form onSubmit={submitAuth} className="form-stack">{authMode === "register" && <label>Full name<input required placeholder="Alex Morgan" value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})}/></label>}<label>Email address<input required type="email" placeholder="you@example.com" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})}/></label><label>Password<input required minLength={8} type="password" placeholder="At least 8 characters" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})}/></label>{error && <div className="error"><AlertCircle size={16}/>{error}</div>}<button className="primary full" disabled={loading}>{loading ? "Please wait…" : authMode === "login" ? "Sign in" : "Create account"} <span>↗</span></button></form><div className="switch-auth">{authMode === "login" ? "New to TaskFlow?" : "Already have an account?"} <button onClick={()=>{setAuthMode(authMode==="login"?"register":"login");setError("");}}>{authMode==="login"?"Create account":"Sign in"}</button></div><div className="secure-note"><span>✦</span> Your workspace is private and secure</div></div><div className="auth-copyright">© 2026 TaskFlow · Built for better days</div></div></div>;

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-icon"><ListTodo size={21}/></span> taskflow<span className="brand-dot">.</span></div><div className="workspace"><div className="workspace-avatar">T</div><div><strong>My workspace</strong><small>PERSONAL PLAN</small></div><ChevronDown size={15}/></div><div className="nav-label">WORKSPACE</div><nav className="side-nav"><button className="active"><LayoutDashboard size={18}/> Overview</button><button onClick={()=>setFilter("All tasks")}><ListTodo size={18}/> All tasks <span className="nav-count">{tasks.length}</span></button><button onClick={()=>setFilter("Today")}><CalendarDays size={18}/> Today</button></nav><div className="nav-label task-label">TASK STATUS</div><nav className="side-nav status-nav"><button onClick={()=>setFilter("Pending")}><span className="status-dot pending-dot"/> To do <span className="nav-count">{stats.pending}</span></button><button onClick={()=>setFilter("In Progress")}><span className="status-dot progress-dot"/> In progress <span className="nav-count">{stats.progress}</span></button><button onClick={()=>setFilter("Completed")}><span className="status-dot complete-dot"/> Completed <span className="nav-count">{stats.completed}</span></button></nav><div className="sidebar-bottom"><div className="tip-card"><div className="tip-icon"><Sparkles size={17}/></div><strong>Small steps add up.</strong><p>Progress is progress, no matter how small.</p><div className="tip-stars">✳ ✦ ✳</div></div><button className="profile" onClick={logout}><div className="avatar">{initials(auth.user?.name)}</div><div className="profile-info"><strong>{auth.user?.name || "My account"}</strong><small>{auth.user?.email}</small></div><LogOut size={16}/></button></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><span className="today-label"><CalendarDays size={15}/> {new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</span><button className="avatar top-avatar" title="Sign out" onClick={logout}>{initials(auth.user?.name)}</button></div></header>
    <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><Sparkles size={15}/> YOUR PERSONAL DASHBOARD</div><h1>Good {new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening"}, {auth.user?.name?.split(" ")[0] || "there"}<span className="wave">✳</span></h1><p className="muted">Let's make today count. Here's your progress at a glance.</p></div><button className="primary create-btn" onClick={openNew}><Plus size={18}/> New task</button></div>
    {notice && <div className="notice"><CheckCircle2 size={16}/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>}{error && <div className="error page-error"><AlertCircle size={16}/>{error}<button onClick={()=>setError("")}><X size={15}/></button></div>}
    <section className="stats-grid"><div className="stat-card stat-purple"><div className="stat-top"><span>Total tasks</span><span className="stat-icon"><ListTodo size={18}/></span></div><div className="stat-number">{stats.total}</div><div className="stat-bottom"><span className="stat-line purple-line"/>Your whole list, in one place</div></div><div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue-icon"><Activity size={18}/></span></div><div className="stat-number">{stats.progress}</div><div className="stat-bottom"><span className="stat-line blue-line"/>Keep the momentum going</div></div><div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green-icon"><CheckCircle2 size={18}/></span></div><div className="stat-number">{stats.completed}</div><div className="stat-bottom"><span className="stat-line green-line"/>Look how far you've come</div></div><div className="stat-card"><div className="stat-top"><span>To do</span><span className="stat-icon orange-icon"><Target size={18}/></span></div><div className="stat-number">{stats.pending}</div><div className="stat-bottom"><span className="stat-line orange-line"/>One thing at a time</div></div></section>
    <section className="tasks-panel"><div className="panel-head"><div><h2>Your tasks <span className="task-total">{visible.length}</span></h2><p>Everything you want to get done.</p></div><button className="sort-button" onClick={()=>setSort(sort==="newest"?"oldest":sort==="oldest"?"due":"newest")}><ArrowDownUp size={15}/>{sort==="newest"?"Newest first":sort==="oldest"?"Oldest first":"Due date"}</button></div><div className="task-toolbar"><div className="filter-pills">{["All tasks","Pending","In Progress","Completed","Today"].map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="search-box"><Search size={16}/><input placeholder="Search tasks..." value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button onClick={()=>setQuery("")}><X size={14}/></button>}</div></div>
    {loading ? <div className="empty-state"><div className="empty-icon"><Activity size={24}/></div><h3>Loading your tasks…</h3><p>Getting your workspace ready.</p></div> : visible.length === 0 ? <div className="empty-state"><div className="empty-icon"><ListTodo size={24}/></div><h3>{query ? "No matching tasks" : filter==="All tasks" ? "Your slate is beautifully clean" : "Nothing here just yet"}</h3><p>{query ? "Try a different search term." : "Add a task and take the first step toward getting it done."}</p>{!query && <button className="primary" onClick={openNew}><Plus size={17}/> Create your first task</button>}</div> : <div className="task-list">{visible.map(task=><article className={`task-row ${task.status==="Completed"?"task-done":""}`} key={task._id}><button className={`task-check ${task.status==="Completed"?"checked":""}`} title="Cycle task status" onClick={()=>changeStatus(task)}>{task.status==="Completed"?<Check size={16}/>:task.status==="In Progress"?<span className="check-half"/>:<Circle size={18}/>}</button><div className="task-copy"><div className="task-title-line"><h3>{task.title}</h3><span className={`priority priority-${task.priority.toLowerCase()}`}><span/> {task.priority}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`status-chip chip-${task.status.toLowerCase().replace(" ","-")}`}>{task.status}</span><span className="due-date"><Clock3 size={13}/>{niceDate(task.dueDate)}</span></div></div><div className="task-actions"><button title="Edit task" onClick={()=>openEdit(task)}><Pencil size={16}/></button><button title="Delete task" onClick={()=>deleteTask(task)}><Trash2 size={16}/></button></div></article>)}</div>}
    <div className="panel-foot"><span>Showing <strong>{visible.length}</strong> of <strong>{tasks.length}</strong> tasks</span><span><span className="live-dot"/> All changes sync to your account</span></div></section>
    <footer className="app-footer"><span>✳ taskflow</span><span>A little more focus. A lot more flow.</span></footer></div></main>
    {modal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className="task-modal"><div className="modal-head"><div><span className="eyebrow"><Sparkles size={14}/> MAKE IT HAPPEN</span><h2>{editing?"Edit task":"Create a new task"}</h2><p>Add the details and we'll keep it organized.</p></div><button className="icon-button" onClick={()=>setModal(false)}><X size={19}/></button></div><form onSubmit={saveTask} className="modal-form"><label>Task title <input autoFocus required maxLength={140} placeholder="e.g. Finish project presentation" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Description <textarea rows="3" placeholder="Add a few details (optional)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="two-fields"><label>Due date <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label><label>Priority <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Status <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setModal(false)}>Cancel</button><button className="primary"><Plus size={17}/>{editing?"Save changes":"Create task"}</button></div></form></div></div>}
  </div>;
}
