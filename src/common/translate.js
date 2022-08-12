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

    // groups
    // gesture: '제스처',
    // action: '액션',
    drag_tracking: '마우스 이동 경로',
    action_preview: '액션 미리보기',

    //gestures
    threshold_angle: '상하좌우(UDLR) 판정 기준 각도',
    sampling_period: '마우스 이동 방향 판정 주기',
    scroll_factor: '페이지 이동 비율',
    use_draw_line: '마우스 이동 경로 표시 여부',
    use_action_preview: '액션 미리보기 표시 여부',
    action_preview_x_offset: '액션 미리보기 가로 위치',
    action_preview_y_offset: '액션 미리보기 세로 위치',

    // actions
    closeTab: '창 닫기',
    goBack: '이전 페이지로',
    goBackOrCloseTab: '이전 페이지로 가거나 창 닫기',
    goForward: '다음 페이지로',
    scrollTop: '맨 위로',
    scrollBottom: '맨 아래로',
    pageDown: '페이지 다운',
    pageUp: '페이지 업',
    restore: '최근에 닫힌 탭 열기',
    keydown: '키보드 입력',
    reload: '새로고침',
    nothing: '아무 작업하지 않음',
}

export const translate = (text) => {
    if (text in word_map) return word_map[text];

    return text;
}