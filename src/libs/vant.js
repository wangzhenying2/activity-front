import {
    Button, Form, Field, CellGroup, Cell, Tab, Tabs, Col, Row, Icon, Grid, GridItem, Checkbox, CheckboxGroup, SubmitBar, Skeleton, Card, Tag, RadioGroup, Radio,
    Popup, Toast, Picker, ActionSheet, Dialog, Empty, Tabbar, TabbarItem, Swipe, SwipeItem, List, PullRefresh, Search, CountDown, PasswordInput, NumberKeyboard
} from 'vant'

export default {
    install: (app, options) => {
        app.use(Button).use(Form).use(Field).use(CellGroup).use(Cell).use(Col).use(Tab).use(Tabs).use(Row).use(Icon).use(Grid).use(GridItem).use(Checkbox).use(CheckboxGroup).use(RadioGroup).use(Radio).use(SubmitBar).use(Skeleton)
            .use(Tag).use(Card).use(Popup).use(Toast).use(Picker).use(ActionSheet).use(Dialog).use(Empty).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(List).use(PullRefresh).use(Search).use(CountDown).use(PasswordInput).use(NumberKeyboard)
    }
}
