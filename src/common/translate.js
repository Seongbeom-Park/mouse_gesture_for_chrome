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

    // gestures
    threshold_angle: '상하좌우(UDLR) 판정 기준 각도',
    sampling_period: '마우스 이동 방향 판정 주기',
    scroll_factor: '페이지 이동 비율',
    scroll_smooth: '부드러운 페이지 이동',
    use_draw_line: '마우스 이동 경로 표시 여부',
    use_action_preview: '액션 미리보기 표시 여부',
    action_preview_font_size: '액션 미리보기 폰트 크기',
    action_preview_font_color: '액션 미리보기 폰트 색상',
    action_preview_background_color: '액션 미리보기 배경 색상',
    action_preview_x_offset: '액션 미리보기 가로 위치',
    action_preview_y_offset: '액션 미리보기 세로 위치',
    line_color_1: '선의 1번 색상',
    line_color_2: '선의 2번 색상',
    line_width_1: '1번 색의 두께',
    line_width_2: '2번 색의 두께',
    color_code: '색상 코드',

    // actions
    closeTab: '현재 탭 닫기',
    closeWindow: '현재 창 닫기',
    goBack: '이전 페이지로',
    goBackOrCloseTab: '이전 페이지로 가거나 탭 닫기',
    goForward: '다음 페이지로',
    scrollTop: '맨 위로',
    scrollBottom: '맨 아래로',
    pageDown: '페이지 다운',
    pageUp: '페이지 업',
    restore: '최근에 닫힌 탭 열기',
    keydown: '키보드 입력',
    reload: '새로고침',
    moveTabLeft: '왼쪽 탭으로 이동',
    moveTabRight: '오른쪽 탭으로 이동',
    moveTabFirst: '가장 왼쪽 탭으로 이동',
    moveTabLast: '가장 오른쪽 탭으로 이동',
    openTab: '새 탭 열기',
    copyTab: '현재 탭 복제',
    openWindow: '새 창 열기',
    normalizeWindow: '창 보통크기',
    minimizeWindow: '창 최소화',
    maximizeWindow: '창 최대화',
    fullscreenWindow: '창 전체화면',
    openOptions: '옵션 열기',
    nothing: '아무 작업하지 않음',

    // rules
    open_options: '옵션 열기'
}

export const translate = (text) => {
    if (text in word_map) return word_map[text];

    return text;
}