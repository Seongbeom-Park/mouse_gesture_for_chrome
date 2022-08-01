import { LitElement, html } from 'lit';
import { MDCDrawer } from '@material/drawer';
import { option_categories } from '@common/default_options';

class NavigationDrawer extends LitElement {
    static properties = {
        main_content_id: {type: String},
    }
    set page (_page) {
        this._page = _page;
        document.getElementById(this.main_content_id).page = _page;
        this.items.forEach((item) => {
            item.activated = false;
        });
    }
    render () {
        this._page = option_categories[0].category;
        this.items = option_categories.map(({category}) => new NavigationDrawerItem(this, category, this._page === category));
        return html`
            <div class="mdc-drawer__content">
                <nav class="mdc-list">
                    ${this.items}
                </nav>
            </div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

class NavigationDrawerItem extends LitElement {
    constructor (drawer, category, activated) {
        super();
        this.parent = drawer;
        this.category = category;
        this.activated = activated;
    }
    updateRouter () {
        this.parent.page = this.category;
        this.activated = true;
    }
    set activated (_activated) {
        if (_activated) this.classList.add('mdc-list-item--activated');
        else this.classList.remove('mdc-list-item--activated');
    }
    render () {
        const translate = (text) => {
            switch (text) {
                case 'settings':
                    return '설정';
                case 'rules':
                    return '규칙';
            }
        }
        return html`
            <a class="mdc-list-item" @click="${this.updateRouter}" aria-current="page">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">${translate(this.category)}</span>
            </a>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('navigation-drawer', NavigationDrawer);
customElements.define('navigation-drawer-item', NavigationDrawerItem);
