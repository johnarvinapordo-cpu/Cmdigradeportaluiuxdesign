// CMDI Grade Portal - Dashboard Application
const NAV = {
  common: [
    {id:'dashboard',label:'Dashboard'},
    {id:'notifications',label:'Notifications'},
    {id:'profile',label:'Profile'}
  ],
  student: [
    {id:'my-grades',label:'My Grades'},
    {id:'my-enrollment',label:'My Enrollment'},
    {id:'my-schedule',label:'My Schedule'},
    {id:'my-payments',label:'My Payments'}
  ],
  teacher: [
    {id:'my-subjects',label:'My Subjects'},
    {id:'enter-grades',label:'Enter Grades'},
    {id:'student-list',label:'Student List'}
  ],
  registrar: [
    {id:'manage-enrollment',label:'Manage Enrollment'},
    {id:'student-records',label:'Student Records'},
    {id:'course-management',label:'Course Management'}
  ],
  finance: [
    {id:'record-payments',label:'Record Payments'},
    {id:'payment-history',label:'Payment History'},
    {id:'tuition-balances',label:'Tuition Balances'}
  ],
  admin: [
    {id:'user-management',label:'User Management'},
    {id:'student-management',label:'Student Management'},
    {id:'teacher-management',label:'Teacher Management'},
    {id:'grades-management',label:'Grades Management'},
    {id:'system-settings',label:'System Settings'}
  ]
};

let user = null;
let view = 'dashboard';

function $(id){ return document.getElementById(id); }
function escape(s){ return (s||'').toString().replace(/[&<>"]/g,c=>({'&':'&amp;','<':'<','>':'>','"':'"'}[c]||c)); }
function badge(type, text){
  const cls = {green:'badge-green',amber:'badge-amber',red:'badge-red',blue:'badge-blue'}[type]||'badge-gray';
  return '<span class="badge '+cls+'">'+escape(text)+'</span>';
}
function alertBox(type, msg){
  return '<div class="alert alert-'+type+'">'+escape(msg)+'</div>';
}
function card(title, body){
  return '<div class="card"><div class="card-header"><h3>'+escape(title||'')+'</h3></div><div class="card-body">'+body+'</div></div>';
}
function table(headers, rows){
  if(!rows||!rows.length) return '<div class="empty-state">No data available</div>';
  let h='<table><thead><tr>'+headers.map(x=>'<th>'+escape(x)+'</th>').join('')+'</tr></thead><tbody>';
  rows.forEach(r=>{ h+='<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>'; });
  return h+'</tbody></table>';
}
function statCard(icon, val, lbl){
  return '<div class="stat-card"><div class="stat-icon blue">'+icon+'</div><div class="stat-info"><h4>'+val+'</h4><p>'+escape(lbl)+'</p></div></div>';
}
function nv(v){ return v!=null?v:'-'; }
function fmtDate(d){ if(!d) return '-'; return new Date(d).toLocaleDateString(); }
function peso(n){ return '&#8369;'+parseFloat(n||0).toLocaleString(); }

async function init(){
  if(!getToken()){ location.href='index.html'; return; }
  user=getUser(); if(!user) user=await fetchCurrentUser();
  if(!user){ location.href='index.html'; return; }
  $('userName').textContent=user.name; $('userRole').textContent=user.role; $('userAvatar').textContent=user.name.charAt(0).toUpperCase();
  renderNav();
  navigateTo(location.hash.replace('#','')||'dashboard');
}

function renderNav(){
  const role=user.role;
  const groups=[{s:'Main',items:NAV.common},{s:toTitle(role)+' Menu',items:NAV[role]||[]}];
  let html='';
  groups.forEach(g=>{
    if(!g.items.length) return;
    html+='<div class="nav-section"><div class="nav-section-title">'+escape(g.s)+'</div><ul>';
    g.items.forEach(i=>{
      const a=i.id===view?'active':'';
      html+='<li><button class="nav-item '+a+'" onclick="navigateTo(\''+i.id+'\')" data-view="'+i.id+'">'+escape(i.label)+'</button></li>';
    });
    html+='</ul></div>';
  });
  $('sidebarNav').innerHTML=html;
}

function toTitle(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function navigateTo(v){
  view=v; location.hash=v;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.view===v));
  const all=[...NAV.common,...Object.values(NAV).flat()];
  const it=all.find(x=>x.id===v);
  $('pageTitle').textContent=it?it.label:'Dashboard';
  renderPage(v);
}

function toggleSidebar(){ $('sidebar').classList.toggle('open'); }

function renderPage(v){
  const c=$('pageContent');
  const role=user?.role;
  if(v==='dashboard') renderDashboard(c,role);
  else if(v==='my-grades') renderMyGrades(c);
  else if(v==='my-enrollment') renderMyEnrollment(c);
  else if(v==='my-schedule') c.innerHTML=card('My Schedule','<div class="empty-state">Schedule view not yet implemented</div>');
  else if(v==='my-payments') renderMyPayments(c);
  else if(v==='my-subjects') renderMySubjects(c);
  else if(v==='enter-grades') renderEnterGrades(c);
  else if(v==='student-list') c.innerHTML=card('Student List','<div class="empty-state">Student list view not yet implemented</div>');
  else if(v==='manage-enrollment') renderManageEnrollment(c);
  else if(v==='student-records') renderStudentRecords(c);
  else if(v==='course-management') renderCourseManagement(c);
  else if(v==='record-payments') renderRecordPayments(c);
  else if(v==='payment-history') renderPaymentHistory(c);
  else if(v==='tuition-balances') renderTuitionBalances(c);
  else if(v==='user-management') renderUserManagement(c);
  else if(v==='student-management') renderStudentManagement(c);
  else if(v==='teacher-management') renderTeacherManagement(c);
  else if(v==='grades-management') renderGradesManagement(c);
  else if(v==='system-settings') c.innerHTML=card('System Settings','<div class="empty-state">System settings not yet implemented</div>');
  else if(v==='notifications') renderNotifications(c);
  else if(v==='profile') renderProfile(c);
  else c.innerHTML='<div class="alert alert-info">Page: '+escape(v)+'</div>';
}

// ============= DASHBOARDS =============

async function renderDashboard(c,role){
  c.innerHTML='<div class="stats-grid" id="ds"></div><div id="dc"></div>';
  if(role==='student') studentDash();
  else if(role==='teacher') teacherDash();
  else if(role==='registrar') registrarDash();
  else if(role==='finance') financeDash();
  else if(role==='admin') adminDash();
}

async function studentDash(){
  const s=$('ds'),d=$('dc');
  try{
    const sid=user.student?.student_id;
    const [gr,pr] = await Promise.all([api.getStudentGrades(sid).catch(()=>({grades:[]})), api.getStudentPayments(sid).catch(()=>({balances:[{balance_amount:0}]}))]);
    const g=gr.grades||[], bal=(pr.balances&&pr.balances[0])||{balance_amount:0}, passed=g.filter(x=>x.remarks==='passed').length;
    s.innerHTML=statCard('&#127891;',g.length,'Subjects')+statCard('&#9989;',passed,'Passed')+statCard('&#128176;',peso(bal.balance_amount),'Balance');
    let h=card('Recent Grades',table(['Subject','Code','Prelim','Mid','PreFinal','Final','Remarks'],g.map(x=>[x.subject_name,x.code,nv(x.prelim),nv(x.midterm),nv(x.prefinal),nv(x.final),badge(x.remarks==='passed'?'green':'gray',x.remarks||'pending')])));
    const ar=await api.getAnnouncements().catch(()=>({announcements:[]}));
    const an=(ar.announcements||[]).slice(0,3);
    if(an.length){ h+=card('Announcements',an.map(a=>'<div style="padding:0.5rem 0;border-bottom:1px solid var(--gray-100)"><strong>'+escape(a.title)+'</strong><p style="margin:0;font-size:0.875rem;color:var(--gray-500)">'+escape(a.content)+'</p></div>').join('')); }
    d.innerHTML=h;
  }catch(e){ d.innerHTML=alertBox('error','Failed to load'); }
}

async function teacherDash(){
  const s=$('ds'),d=$('dc');
  try{
    const r=await api.getTeacherSubjects().catch(()=>({subjects:[]}));
    const sub=r.subjects||[];
    s.innerHTML=statCard('&#128218;',sub.length,'Subjects');
    d.innerHTML=card('My Subjects',table(['Code','Name','Year','Sem','Section'],sub.map(x=>[x.code,x.name,nv(x.year_level),x.semester,nv(x.section)])));
  }catch(e){ d.innerHTML=alertBox('error','Failed to load'); }
}

async function registrarDash(){
  const s=$('ds'),d=$('dc');
  try{
    const [er,sr]=await Promise.all([api.getPendingEnrollments().catch(()=>({enrollments:[]})), api.getStudents().catch(()=>({students:[]}))]);
    const p=(er.enrollments||[]).length, st=(sr.students||[]).length;
    s.innerHTML=statCard('&#128226;',p,'Pending')+statCard('&#127891;',st,'Students');
    d.innerHTML=card('Quick Actions','<div style="display:flex;gap:0.5rem;flex-wrap:wrap"><button class="btn btn-blue" onclick="navigateTo(\'manage-enrollment\')">Manage Enrollment</button><button class="btn btn-blue" onclick="navigateTo(\'student-records\')">Student Records</button><button class="btn btn-blue" onclick="navigateTo(\'course-management\')">Courses</button></div>');
  }catch(e){ d.innerHTML=alertBox('error','Failed to load'); }
}

async function financeDash(){
  const s=$('ds'),d=$('dc');
  try{
    const r=await api.getPaymentSummary().catch(()=>({}));
    s.innerHTML=statCard('&#128176;',peso(r.totalCollected||0),'Collected')+statCard('&#128185;',peso(r.totalOutstanding||0),'Outstanding')+statCard('&#128101;',r.enrolledStudents||0,'Students');
    const rp=r.recentPayments||[];
    d.innerHTML=card('Recent Payments',table(['Student','Amount','Type','Date'],rp.map(x=>[x.student_name,peso(x.amount),x.payment_type,fmtDate(x.paid_at)])));
  }catch(e){ d.innerHTML=alertBox('error','Failed to load'); }
}

async function adminDash(){
  const s=$('ds'),d=$('dc');
  try{
    const [ur,sr,tr]=await Promise.all([api.getUsers().catch(()=>({users:[]})), api.getStudents().catch(()=>({students:[]})), api.getTeachers().catch(()=>({teachers:[]}))]);
    const u=(ur.users||[]).length, st=(sr.students||[]).length, te=(tr.teachers||[]).length;
    s.innerHTML=statCard('&#128101;',u,'Users')+statCard('&#127891;',st,'Students')+statCard('&#128221;',te,'Teachers');
    d.innerHTML=card('Quick Access','<div style="display:flex;gap:0.5rem;flex-wrap:wrap"><button class="btn btn-blue" onclick="navigateTo(\'user-management\')">Users</button><button class="btn btn-blue" onclick="navigateTo(\'student-management\')">Students</button><button class="btn btn-blue" onclick="navigateTo(\'teacher-management\')">Teachers</button><button class="btn btn-blue" onclick="navigateTo(\'grades-management\')">Grades</button></div>');
  }catch(e){ d.innerHTML=alertBox('error','Failed to load'); }
}

// ============= STUDENT VIEWS =============

async function renderMyGrades(c){
  try{
    const r=await api.getStudentGrades(user.student?.student_id);
    c.innerHTML=card('My Grades',table(['Subject','Code','Prelim','Mid','PreFinal','Final','Remarks'],(r.grades||[]).map(g=>[g.subject_name,g.code,nv(g.prelim),nv(g.midterm),nv(g.prefinal),nv(g.final),badge(g.remarks==='passed'?'green':g.remarks==='failed'?'red':'gray',g.remarks||'pending')])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderMyEnrollment(c){
  try{
    const r=await api.getEnrollments();
    const mine=(r.enrollments||[]).filter(e=>e.student_id==user.student?.student_id);
    c.innerHTML=card('My Enrollment',table(['Subject','Code','Year','Sem','Status'],mine.map(e=>[e.subject_name,e.code,e.school_year,e.semester,badge(e.status==='approved'?'green':e.status==='pending'?'amber':'red',e.status)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderMyPayments(c){
  try{
    const r=await api.getStudentPayments(user.student?.student_id);
    const p=r.payments||[], bal=(r.balances&&r.balances[0])||{total_amount:0,paid_amount:0,balance_amount:0};
    let h='<p><strong>Total:</strong> '+peso(bal.total_amount)+' &nbsp; <strong>Paid:</strong> '+peso(bal.paid_amount)+' &nbsp; <strong>Balance:</strong> '+peso(bal.balance_amount)+'</p>';
    h+=table(['Amount','Type','Description','Status','Date'],p.map(x=>[peso(x.amount),x.payment_type,escape(x.description||'-'),badge(x.status==='completed'?'green':'amber',x.status),fmtDate(x.paid_at)]));
    c.innerHTML=card('My Payments',h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

// ============= TEACHER VIEWS =============

async function renderMySubjects(c){
  try{
    const r=await api.getTeacherSubjects();
    c.innerHTML=card('My Subjects',table(['Code','Name','Year','Sem','Section'],(r.subjects||[]).map(s=>[s.code,s.name,nv(s.year_level),s.semester,nv(s.section)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderEnterGrades(c){
  try{
    const r=await api.getTeacherSubjects();
    const sub=r.subjects||[];
    if(!sub.length){ c.innerHTML=card('Enter Grades','<div class="alert alert-info">No subjects assigned</div>'); return; }
    let h='<label class="form-label">Select Subject</label><select id="egSub" class="form-control" onchange="loadGradeStudents(this.value)"><option value="">-- Select --</option>';
    sub.forEach(s=>{ h+='<option value="'+s.subject_id+'">'+s.code+' - '+s.name+'</option>'; });
    h+='</select><div id="egArea" style="margin-top:1rem"></div>';
    c.innerHTML=card('Enter Grades',h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function loadGradeStudents(sid){
  const a=$('egArea'); if(!sid){ a.innerHTML=''; return; }
  try{
    const r=await api.getSubjectStudents(sid);
    const st=r.students||[];
    if(!st.length){ a.innerHTML='<div class="alert alert-info">No students enrolled</div>'; return; }
    let h='<div class="table-container"><table><thead><tr><th>Student</th><th>Prelim</th><th>Mid</th><th>PreFinal</th><th>Final</th><th></th></tr></thead><tbody>';
    st.forEach(s=>{
      h+='<tr data-sid="'+s.student_id+'"><td>'+escape(s.name)+'<br><small>'+s.student_number+'</small></td>';
      ['prelim','midterm','prefinal','final'].forEach(f=>{
        h+='<td><input type="number" class="grade-input" id="g_'+s.student_id+'_'+f+'" value="'+nv(s[f])+'"></td>';
      });
      h+='<td><button class="btn btn-green btn-sm" onclick="saveGrade('+s.student_id+','+sid+')">Save</button></td></tr>';
    });
    a.innerHTML=h+'</tbody></table></div>';
  }catch(e){ a.innerHTML=alertBox('error',e.message); }
}

async function saveGrade(studentId, subjectId){
  const data={ student_id:studentId, subject_id:subjectId };
  ['prelim','midterm','prefinal','final'].forEach(f=>{
    const v=document.getElementById('g_'+studentId+'_'+f).value;
    if(v!=='') data[f]=parseFloat(v);
  });
  try{ await api.submitGrades(data); alert('Grade saved'); }catch(e){ alert('Error: '+e.message); }
}

// ============= REGISTRAR VIEWS =============

async function renderManageEnrollment(c){
  try{
    const r=await api.getPendingEnrollments();
    const list=(r.enrollments||[]);
    let h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3>Enrollment Requests</h3></div>';
    h+=table(['Student','Course','Subject','Year','Sem','Status','Actions'],list.map(e=>[
      e.student_name,e.course,e.subject_name,e.school_year,e.semester,
      badge('amber','pending'),
      '<button class="btn btn-green btn-sm" onclick="enrollAction('+e.enrollment_id+',\'approve\')">Approve</button> <button class="btn btn-red btn-sm" onclick="enrollAction('+e.enrollment_id+',\'reject\')">Reject</button>'
    ]));
    c.innerHTML=card(null,h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function enrollAction(id, action){
  try{
    if(action==='approve') await api.approveEnrollment(id);
    else await api.rejectEnrollment(id);
    alert(toTitle(action)+'d successfully'); renderManageEnrollment($('pageContent'));
  }catch(e){ alert('Error: '+e.message); }
}

async function renderStudentRecords(c){
  try{
    const r=await api.getStudents();
    const st=(r.students||[]);
    c.innerHTML=card('Student Records',table(['#','Name','Student #','Course','Year','Section','Status'],st.map((s,i)=>[i+1,s.name,s.student_number,s.course,s.year_level,nv(s.section),badge(s.enrollment_status==='enrolled'?'green':'gray',s.enrollment_status)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderCourseManagement(c){
  try{
    const r=await api.getSubjects();
    const sub=(r.subjects||[]);
    let h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3>Courses</h3><button class="btn btn-blue" onclick="alert(\'Add course modal coming soon\')">Add Course</button></div>';
    h+=table(['Code','Name','Units','Year','Semester'],sub.map(s=>[s.code,s.name,s.units,nv(s.year_level),s.semester]));
    c.innerHTML=card(null,h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

// ============= FINANCE VIEWS =============

async function renderRecordPayments(c){
  c.innerHTML=card('Record Payment','
    <div class="form-row">
      <div><label class="form-label">Student ID</label><input type="number" id="rp_sid" class="form-control" placeholder="Student ID"></div>
      <div><label class="form-label">Amount</label><input type="number" id="rp_amt" class="form-control" placeholder="Amount"></div>
    </div>
    <div class="form-row">
      <div><label class="form-label">Type</label><select id="rp_type" class="form-control"><option value="tuition">Tuition</option><option value="miscellaneous">Miscellaneous</option><option value="laboratory">Laboratory</option><option value="other">Other</option></select></div>
      <div><label class="form-label">Description</label><input type="text" id="rp_desc" class="form-control" placeholder="Description"></div>
    </div>
    <button class="btn btn-blue" onclick="submitPayment()">Record Payment</button>');
}

async function submitPayment(){
  const data={ student_id:parseInt($('rp_sid').value), amount:parseFloat($('rp_amt').value), payment_type:$('rp_type').value, description:$('rp_desc').value };
  try{ await api.recordPayment(data); alert('Payment recorded'); $('rp_sid').value=''; $('rp_amt').value=''; $('rp_desc').value=''; }catch(e){ alert('Error: '+e.message); }
}

async function renderPaymentHistory(c){
  try{
    const r=await api.getPayments();
    c.innerHTML=card('Payment History',table(['Student','Amount','Type','Description','Status','Date'],(r.payments||[]).map(p=>[p.student_name,peso(p.amount),p.payment_type,escape(p.description||'-'),badge(p.status==='completed'?'green':'amber',p.status),fmtDate(p.paid_at)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderTuitionBalances(c){
  try{
    const r=await api.getBalances();
    c.innerHTML=card('Tuition Balances',table(['Student','Year','Sem','Total','Paid','Balance'],(r.balances||[]).map(b=>[b.student_name,b.school_year,b.semester,peso(b.total_amount),peso(b.paid_amount),peso(b.balance_amount)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

// ============= ADMIN VIEWS =============

async function renderUserManagement(c){
  try{
    const r=await api.getUsers();
    const u=(r.users||[]);
    let h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3>Users</h3><button class="btn btn-blue" onclick="alert(\'Add user modal coming soon\')">Add User</button></div>';
    h+=table(['ID','Name','Email','Role','Status'],u.map(x=>[x.id,x.name,x.email,toTitle(x.role),badge(x.is_active?'green':'red',x.is_active?'Active':'Inactive')]));
    c.innerHTML=card(null,h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderStudentManagement(c){
  try{
    const r=await api.getStudents();
    c.innerHTML=card('Student Management',table(['#','Name','Student #','Course','Year','Section','Status'],(r.students||[]).map((s,i)=>[i+1,s.name,s.student_number,s.course,s.year_level,nv(s.section),badge(s.enrollment_status==='enrolled'?'green':'gray',s.enrollment_status)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderTeacherManagement(c){
  try{
    const r=await api.getTeachers();
    c.innerHTML=card('Teacher Management',table(['ID','Name','Employee #','Department'],(r.teachers||[]).map(t=>[t.teacher_id,t.name,t.employee_number,nv(t.department)])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderGradesManagement(c){
  try{
    const r=await api.getAllGrades();
    c.innerHTML=card('All Grades',table(['Student','Subject','Prelim','Mid','PreFinal','Final','Remarks'],(r.grades||[]).map(g=>[g.student_name,g.subject_name,nv(g.prelim),nv(g.midterm),nv(g.prefinal),nv(g.final),badge(g.remarks==='passed'?'green':g.remarks==='failed'?'red':'gray',g.remarks||'-')])));
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

// ============= COMMON VIEWS =============

async function renderNotifications(c){
  try{
    const r=await api.getAnnouncements();
    c.innerHTML=card('Notifications',(r.announcements||[]).map(a=>'<div style="padding:0.75rem 0;border-bottom:1px solid var(--gray-100)"><strong>'+escape(a.title)+'</strong><p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--gray-500)">'+escape(a.content)+'</p><small style="color:var(--gray-400)">'+fmtDate(a.created_at)+'</small></div>').join('')||'<div class="empty-state">No announcements</div>');
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

async function renderProfile(c){
  try{
    const r=await apiRequest('/auth/me');
    const u=r.user;
    let h='<div style="max-width:400px">';
    h+='<p><strong>Name:</strong> '+escape(u.name)+'</p>';
    h+='<p><strong>Email:</strong> '+escape(u.email)+'</p>';
    h+='<p><strong>Role:</strong> '+toTitle(u.role)+'</p>';
    if(u.student){
      h+='<p><strong>Student #:</strong> '+u.student.student_number+'</p>';
      h+='<p><strong>Course:</strong> '+u.student.course+'</p>';
      h+='<p><strong>Year Level:</strong> '+u.student.year_level+'</p>';
      h+='<p><strong>Section:</strong> '+nv(u.student.section)+'</p>';
    }
    if(u.teacher){
      h+='<p><strong>Employee #:</strong> '+u.teacher.employee_number+'</p>';
      h+='<p><strong>Department:</strong> '+nv(u.teacher.department)+'</p>';
    }
    h+='</div>';
    c.innerHTML=card('My Profile',h);
  }catch(e){ c.innerHTML=alertBox('error',e.message); }
}

init();

