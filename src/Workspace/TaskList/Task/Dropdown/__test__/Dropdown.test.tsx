import { Dropdown } from "../Dropdown"
import { shallow } from "enzyme"
import React from "react"
import { isExportDeclaration } from "typescript"

describe('Dropdown', () => {
    test('should render', () => {
        const wrapper = shallow(<Dropdown children={<div />} button={<button/>} node={document.createElement('div')}/>)
        expect(wrapper).toBeDefined();
        // console.log(wrapper.find('button').debug());
        expect(wrapper.find('button').isEmptyRender()).toBeFalsy();
    })

    // test('should render (snapshot)', () => {
    //     const wrapper = shallow(<Dropdown children={<div />} button={<button/>} node={document.createElement('div')}/>)

    //     expect(wrapper).toMatchSnapshot();
    // })
})