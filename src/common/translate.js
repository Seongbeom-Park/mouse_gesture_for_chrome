const word_map = {
    // category
    settings: '설정',
    rules: '규칙',

    // options
    domain: '도메인',
    gesture: '제스처',
    action: '액션',
    action_details: '세부항목',
    edit: '수정',
    delete: '삭제',

    // actions
    closeTab: '창 닫기',
    goBack: '이전 페이지로',
    goBackOrCloseTab: '이전 페이지로 가거나 창 닫기',
    goForward: '다음 페이지로',
    scrollTop: '맨 위로',
    scrollBottom: '맨 아래로',
    pageDown: '페이지 업',
    pageUp: '페이지 다운',
    restore: '최근에 닫힌 탭 열기',
    keydown: '키보드 입력',
    reload: '새로고침',
}

export const translate = (text) => {
    if (text in word_map) return word_map[text];

    return text;
}