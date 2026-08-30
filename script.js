let _supabase;
let currentTab = "interview";
let isAdmin = false;

// 날짜 포맷 함수
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}

// 탭 전환
function switchTab(category) {
  currentTab = category;
  const tabs = document.querySelectorAll('.tab-btn');
  const searchBox = document.getElementById('searchBox');

  if (tabs.length >= 3) {
    tabs[0].classList.toggle('active', category === 'interview');
    tabs[1].classList.toggle('active', category === 'rumor');
    tabs[2].classList.toggle('active', category === 'request');
  }

  if (category === 'interview') {
    if (searchBox) searchBox.style.display = 'flex';
    searchInterviews();
  } else if (category === 'rumor') {
    if (searchBox) searchBox.style.display = 'none';
    renderBrandIntro();
  } else if (category === 'request') {
    if (searchBox) searchBox.style.display = 'none';
    renderRequestTab();
  }
}

// 브랜드 소개 렌더링
function renderBrandIntro() {
  document.getElementById("results").innerHTML = `
      <div style="text-align: center; padding: 48px 24px; background: #111; color: #fff; border: 1px solid #111; border-radius: 0px; margin-bottom: 24px;">
        <span style="font-size: 0.8em; letter-spacing: 2px; text-transform: uppercase; color: #888; font-weight: bold; display: block; margin-bottom: 12px;">ABOUT US</span>
        <h2 style="margin: 0 0 20px 0; color: #fff; font-weight: bold; font-size: 1.6em; word-break: keep-all;">
          사람의 이야기를 듣습니다, 카더라
        </h2>
        <p style="margin: 0; color: #ccc; line-height: 1.9; font-size: 0.9em; word-break: keep-all;">
          카더라는 다양한 분야에서 자신만의 길을 만들어가는 사람들의 이야기를<br>
          인터뷰로 담아내는 콘텐츠 채널입니다.<br><br>
          누군가는 어떻게 시작했는지,<br>
          어떤 생각으로 자신의 일을 만들어가는지,<br>
          그리고 우리가 쉽게 알 수 없었던 그들의 이야기는 무엇인지.<br><br>
          카더라는 직접 묻고, 듣고, 기록합니다.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div style="border: 1px solid #111; padding: 24px 20px; border-radius: 0px; background: #fff; position: relative; box-sizing: border-box;">
          <strong style="display: block; margin-bottom: 8px; color: #111; font-size: 1em; text-align: center;">왜 시작했을까</strong>
          <span style="font-size: 0.82em; color: #666; display: block; text-align: center; line-height: 1.5;">누군가의 시작에는 어떤 계기가 있었을까</span>
        </div>
        <div style="border: 1px solid #111; padding: 24px 20px; border-radius: 0px; background: #fff; position: relative; box-sizing: border-box;">
          <strong style="display: block; margin-bottom: 8px; color: #111; font-size: 1em; text-align: center;">어떻게 만들어갈까</strong>
          <span style="font-size: 0.82em; color: #666; display: block; text-align: center; line-height: 1.5;">자신만의 길을 만들어가는 과정은 어떨까</span>
        </div>
        <div style="border: 1px solid #111; padding: 24px 20px; border-radius: 0px; background: #fff; position: relative; box-sizing: border-box;">
          <strong style="display: block; margin-bottom: 8px; color: #111; font-size: 1em; text-align: center;">무슨 생각을 할까</strong>
          <span style="font-size: 0.82em; color: #666; display: block; text-align: center; line-height: 1.5;">그 일을 계속하는 이유는 무엇일까</span>
        </div>
        <div style="border: 1px solid #111; padding: 24px 20px; border-radius: 0px; background: #fff; position: relative; box-sizing: border-box;">
          <strong style="display: block; margin-bottom: 8px; color: #111; font-size: 1em; text-align: center;">어떤 이야기가 있을까</strong>
          <span style="font-size: 0.82em; color: #666; display: block; text-align: center; line-height: 1.5;">우리가 몰랐던 이야기를 직접 들어봅니다</span>
        </div>
      </div>
  `;
}

// 듣고 싶은 사람 탭 렌더링
async function renderRequestTab() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <div class="request-container" style="border: 1px solid #111; padding: 24px; background: #fff; border-radius: 0px;">
      <p class="request-banner" style="font-weight: bold; color: #111; text-align: center; margin-bottom: 8px; font-size: 1em;">
        여러분의 소중한 의견 하나가 다음 인터뷰의 아이디어가 됩니다.
      </p>
      <p style="font-size: 0.8em; color: #777; margin-bottom: 20px; text-align: center;">
        ※ 원활한 운영을 위해 요청 제출은 <strong>1일 1회</strong>만 가능합니다 ※
      </p>
      <div class="request-form" style="display: flex; flex-direction: column; gap: 10px;">
        <input type="text" id="reqTarget" placeholder="인터뷰를 듣고 싶은 분 (예: 홍길동, OO개발자)" style="padding: 12px; border: 1px solid #111; border-radius: 0px; font-size: 0.85em; font-family: inherit; outline: none; background: #fff;">
        <textarea id="reqQuestion" placeholder="이분에게 꼭 묻고 싶은 질문을 남겨주세요." style="padding: 12px; border: 1px solid #111; border-radius: 0px; font-size: 0.85em; font-family: inherit; outline: none; height: 100px; resize: vertical; background: #fff;"></textarea>
        <button class="btn-primary" style="width: 100%; padding: 12px; background: #111; color: #fff; border: 1px solid #111; border-radius: 0px; font-size: 0.9em; font-weight: bold; cursor: pointer;" onclick="submitRequest()">의견 제출하기</button>
      </div>
      <hr style="border: 0; border-top: 1px solid #111; margin: 24px 0;">
      <div id="requestList" style="text-align: center; color: #666; font-size: 0.85em; padding: 10px 0;">
        <p style="margin: 0;">제출하신 의견은 관리자에게 안전하게 전달됩니다.</p>
      </div>
    </div>
  `;

  if (isAdmin) {
    loadRequests();
  }
}

// 요청 목록 조회 (관리자용)
async function loadRequests() {
  const listDiv = document.getElementById("requestList");
  if (!listDiv) return;

  listDiv.innerHTML = "<p style='color:#888;'>요청 데이터를 불러오는 중...</p>";

  const { data: requests, error } = await _supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("요청 목록 조회 오류:", error);
    listDiv.innerHTML = "<p style='color:#e74c3c;'>요청 목록을 불러오지 못했습니다.</p>";
    return;
  }

  if (!requests || requests.length === 0) {
    listDiv.innerHTML = "<p style='color:#888;'>등록된 요청이 없습니다.</p>";
    return;
  }

  listDiv.innerHTML = `
    <div style="text-align: left; margin-top: 16px;">
      <h3 style="font-size: 1em; margin-bottom: 12px; color: #111; font-weight: bold;">[관리자] 접수된 의견 목록 (${requests.length}건)</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${requests.map(req => `
          <div style="border: 1px solid #111; padding: 12px; background: #fafafa; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.9em; color: #111;">대상: ${req.target_name || '미지정'}</strong>
              <span style="font-size: 0.75em; color: #888;">${formatDate(req.created_at)}</span>
            </div>
            <p style="font-size: 0.85em; color: #333; margin: 0; white-space: pre-line; line-height: 1.5;">${req.question || ''}</p>
            <button onclick="deleteRequest(${req.id})" style="margin-top: 8px; padding: 4px 8px; background: #ff4d4f; color: #fff; border: none; font-size: 0.75em; cursor: pointer; font-weight: bold;">삭제</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 요청 삭제 (관리자용)
async function deleteRequest(id) {
  if (!confirm("이 요청을 삭제하시겠습니까?")) return;

  const { error } = await _supabase
    .from('requests')
    .delete()
    .eq('id', id);

  if (error) {
    alert("삭제 실패: " + error.message);
  } else {
    alert("삭제되었습니다.");
    loadRequests();
  }
}

// 요청 제출
async function submitRequest() {
  const targetInput = document.getElementById("reqTarget");
  const questionInput = document.getElementById("reqQuestion");

  const targetName = targetInput.value.trim();
  const question = questionInput.value.trim();

  if (!targetName || !question) {
    alert("이름과 질문을 모두 작성해 주세요.");
    return;
  }

  const lastSubmitTime = localStorage.getItem("last_request_submit");
  const NOW = new Date().getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (lastSubmitTime && (NOW - parseInt(lastSubmitTime)) < ONE_DAY) {
    alert("원활한 진행을 위해 1일 1회만 제출 가능합니다. 내일 다시 시도해 주세요!");
    return;
  }

  const { error } = await _supabase
    .from('requests')
    .insert([{ target_name: targetName, question: question }]);

  if (error) {
    console.error("요청 저장 오류:", error);
    alert("제출 중 오류가 발생했습니다: " + error.message);
  } else {
    alert("의견이 성공적으로 전달되었습니다!");
    localStorage.setItem("last_request_submit", NOW.toString());
    targetInput.value = "";
    questionInput.value = "";
    
    if (isAdmin) {
      loadRequests();
    }
  }
}

// 좋아요 토글 기능
async function likeInterview(id, btnElement) {
  let likedList = JSON.parse(localStorage.getItem('liked_interviews') || '[]');
  const isLiked = likedList.includes(id);

  const countSpan = btnElement.querySelector('.like-count');
  const iconSpan = btnElement.querySelector('.like-icon');
  
  let currentCount = parseInt(countSpan ? countSpan.innerText : "0", 10) || 0;
  let newLikes = isLiked ? currentCount - 1 : currentCount + 1;
  if (newLikes < 0) newLikes = 0;

  const { error } = await _supabase
    .from('interviews')
    .update({ likes: newLikes })
    .eq('id', id);

  if (error) {
    console.error("좋아요 처리 오류:", error);
    alert("좋아요 반영 실패: " + error.message);
    return;
  }

  if (isLiked) {
    likedList = likedList.filter(item => item !== id);
    if (iconSpan) iconSpan.innerText = "🤍";
  } else {
    likedList.push(id);
    if (iconSpan) iconSpan.innerText = "❤️";
  }

  localStorage.setItem('liked_interviews', JSON.stringify(likedList));
  if (countSpan) countSpan.innerText = newLikes;
}

// 댓글 영역 토글
function toggleComments(id) {
  const commentBox = document.getElementById(`comments-box-${id}`);
  const toggleBtn = document.getElementById(`comment-btn-${id}`);
  
  if (commentBox.style.display === "none" || commentBox.style.display === "") {
    commentBox.style.display = "block";
    toggleBtn.innerText = "💬 댓글 접기";
  } else {
    commentBox.style.display = "none";
    toggleBtn.innerText = "💬 댓글 보기";
  }
}

// 댓글 작성
async function addComment(interviewId) {
  const input = document.getElementById(`comment-input-${interviewId}`);
  const content = input.value.trim();

  if (!content) {
    alert("댓글 내용을 입력해 주세요.");
    return;
  }

  const { error } = await _supabase
    .from('comments')
    .insert([{ interview_id: interviewId, content: content }]);

  if (error) {
    alert("댓글 등록 실패: " + error.message);
  } else {
    input.value = "";
    await refreshComments(interviewId);
  }
}

// 댓글 삭제 (관리자용)
async function deleteComment(commentId, interviewId) {
  if (!confirm("이 댓글을 삭제하시겠습니까?")) return;

  const { error } = await _supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    alert("댓글 삭제 실패: " + error.message);
  } else {
    await refreshComments(interviewId);
  }
}

// 댓글 목록 갱신
async function refreshComments(interviewId) {
  const { data: comments, error } = await _supabase
    .from('comments')
    .select('*')
    .eq('interview_id', interviewId)
    .order('created_at', { ascending: true });

  if (error) return;

  const commentsBox = document.getElementById(`comments-box-${interviewId}`);
  if (!commentsBox) return;

  const countHeader = commentsBox.querySelector('.comment-count-text');
  if (countHeader) countHeader.innerText = `댓글 (${comments.length})`;

  const commentsListDiv = commentsBox.querySelector('.comments-list');
  if (commentsListDiv) {
    if (comments.length === 0) {
      commentsListDiv.innerHTML = '<p style="color:#888; font-size:0.9em; padding: 12px 0;">첫 댓글을 남겨보세요.</p>';
    } else {
      commentsListDiv.innerHTML = comments.map(c => `
        <div class="comment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e5e5;">
          <span style="font-size: 0.9em; color: #111;">${c.content}</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.75em; color: #888;">${formatDate(c.created_at)}</span>
            ${isAdmin ? `<button onclick="deleteComment(${c.id}, ${interviewId})" style="padding: 2px 6px; background: #ff4d4f; color: #fff; border: none; font-size: 0.7em; cursor: pointer;">삭제</button>` : ''}
          </div>
        </div>
      `).join('');
    }
  }
}

// 인터뷰 게시물 삭제 (관리자용)
async function deleteInterview(id) {
  if (!confirm("이 인터뷰 글을 삭제하시겠습니까? 관련 댓글도 함께 삭제될 수 있습니다.")) return;

  const { error } = await _supabase
    .from('interviews')
    .delete()
    .eq('id', id);

  if (error) {
    alert("게시물 삭제 실패: " + error.message);
  } else {
    alert("게시물이 삭제되었습니다.");
    searchInterviews();
  }
}

// 게시글 및 댓글 조회 (원본 전체 기능 포함)
async function searchInterviews() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput ? searchInput.value.trim() : "";
  const resultsDiv = document.getElementById("results");

  if (!resultsDiv) return;
  resultsDiv.innerHTML = "<p style='color:#888;'>검색 중...</p>";

  let supabaseQuery = _supabase
    .from('interviews')
    .select('*, comments(*)')
    .order('created_at', { ascending: false });

  if (query !== "") {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }

  let { data: interviews, error } = await supabaseQuery;

  if (error || !interviews || interviews.length === 0) {
    resultsDiv.innerHTML = "<p style='color:#888;'>등록된 글이 없습니다.</p>";
    return;
  }

  const likedList = JSON.parse(localStorage.getItem('liked_interviews') || '[]');

  resultsDiv.innerHTML = interviews.map((item) => {
    const commentList = item.comments || [];
    commentList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const isLiked = likedList.includes(item.id);

    const commentsHtml = commentList.length > 0 
      ? commentList.map(c => `
          <div class="comment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e5e5;">
            <span style="font-size: 0.9em; color: #111;">${c.content}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.75em; color: #888;">${formatDate(c.created_at)}</span>
              ${isAdmin ? `<button onclick="deleteComment(${c.id}, ${item.id})" style="padding: 2px 6px; background: #ff4d4f; color: #fff; border: none; font-size: 0.7em; cursor: pointer;">삭제</button>` : ''}
            </div>
          </div>
        `).join('')
      : '<p style="color:#888; font-size:0.9em; padding: 12px 0;">첫 댓글을 남겨보세요.</p>';

    return `
      <details class="card" style="border: none; border-bottom: 1px solid #e1e1e1; padding: 16px 0; margin-bottom: 0;">
        <summary style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; list-style: none; outline: none;">
          <strong style="font-size: 1.05em; color: #111;">${item.title || '제목 없음'}</strong>
          <span class="card-date" style="color: #888; font-size: 0.82em;">${formatDate(item.created_at)}</span>
        </summary>
        
        <div class="card-body" style="padding-top: 16px; margin-top: 12px; border-top: 1px dashed #eee;">
          <p class="card-content" style="font-size: 0.95em; color: #222; margin-bottom: 20px; line-height: 1.6; white-space: pre-line;">${item.content || ''}</p>

          <!-- 버튼 영역 (좋아요, 댓글보기, 관리자 삭제) -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center;">
            <button onclick="likeInterview(${item.id}, this)" style="background: #fff; border: 1px solid #111; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.82em; font-weight: bold; color: #111;">
              <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span> 
              <span class="like-count">${item.likes || 0}</span>
            </button>
            <button id="comment-btn-${item.id}" onclick="toggleComments(${item.id})" style="background: #fff; border: 1px solid #111; padding: 6px 12px; cursor: pointer; color: #111; font-size: 0.82em; font-weight: bold;">
              💬 댓글 보기
            </button>
            ${isAdmin ? `<button onclick="deleteInterview(${item.id})" style="background: #ff4d4f; color: #fff; border: 1px solid #ff4d4f; padding: 6px 12px; cursor: pointer; font-size: 0.82em; font-weight: bold;">🗑️ 게시물 삭제</button>` : ''}
          </div>

          <!-- 댓글 박스 -->
          <div id="comments-box-${item.id}" class="comments-section" style="display: none; background: #fafafa; padding: 16px; border: 1px solid #111;">
            <strong class="comment-count-text" style="font-size: 0.88em; color: #111; display: block; margin-bottom: 8px;">댓글 (${commentList.length})</strong>
            <div class="comments-list">${commentsHtml}</div>
            <div style="margin-top: 12px;">
              <div class="comment-input-box" style="display: flex;">
                <input type="text" id="comment-input-${item.id}" placeholder="댓글을 입력하세요..." style="flex: 1; padding: 8px 10px; border: 1px solid #111; border-right: none; font-size: 0.82em; outline: none; background: #fff;">
                <button onclick="addComment(${item.id})" style="padding: 8px 16px; background: #111; color: #fff; border: 1px solid #111; font-size: 0.82em; font-weight: bold; cursor: pointer;">작성</button>
              </div>
            </div>
          </div>
        </div>
      </details>
    `;
  }).join('');
}

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://crktpygtwbgxrmgohplz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_1hWtLSvopPq8Y-ac7LobNw_k-rSAd8G";
  
  _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const modal = document.getElementById("modalOverlay");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  if (openBtn) openBtn.addEventListener("click", () => { if (modal) modal.style.display = "flex"; });
  if (closeBtn) closeBtn.addEventListener("click", () => { if (modal) modal.style.display = "none"; });

  const authBtn = document.getElementById("authBtn");
  if (authBtn) {
    authBtn.addEventListener("click", () => {
      const inputPw = document.getElementById("adminPassword").value;
      if (inputPw === "We241054*") {
        alert("관리자 인증 성공!");
        isAdmin = true;
        document.getElementById("authStep").style.display = "none";
        document.getElementById("writeStep").style.display = "block";
        
        // 관리자로 전환되었으므로 렌더링 갱신
        if (currentTab === 'interview') searchInterviews();
        else if (currentTab === 'request') renderRequestTab();
      } else {
        alert("비밀번호가 올바르지 않습니다.");
      }
    });
  }

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const titleInput = document.getElementById("writeTitle");
      const contentInput = document.getElementById("writeContent");

      const title = titleInput.value.trim();
      const content = contentInput.value.trim();

      if (!title || !content) {
        alert("제목과 내용을 모두 입력해 주세요.");
        return;
      }

      const { error } = await _supabase
        .from('interviews')
        .insert([{ title: title, content: content }]);

      if (error) {
        console.error("등록 오류:", error);
        alert("글 등록 실패: " + error.message);
      } else {
        alert("성공적으로 등록되었습니다!");
        titleInput.value = "";
        contentInput.value = "";
        if (modal) modal.style.display = "none";
        searchInterviews();
      }
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", searchInterviews);

  searchInterviews();
});