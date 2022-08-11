/* eslint-disable import/no-anonymous-default-export */
const initState = {
    updateFlag: 0
}

export default function (state = initState, actions) {
    switch (actions.type) {
        case 'forceUpdate':
            return {
                ...{
                    updateFlag: ++state.updateFlag
                }
            }
            default:
                return state
    }
}