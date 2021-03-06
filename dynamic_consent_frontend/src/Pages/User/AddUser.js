import { Button, DatePicker, Form, Icon, Input, Layout } from "antd";
import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import axios from "axios";
import gql from "graphql-tag";

const { Content } = Layout;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddUser extends Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        const link = new HttpLink({
            uri: `http://${this.props.IP}`
        });
        const cache = new InMemoryCache();
        const client = new ApolloClient({
            cache,
            link
        });

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const ADD_USER = gql`
                    mutation {
                        createUser(email: "${values.email}", firstName: "${
                    values.firstName
                }", lastName: "${
                    values.lastName
                }", dateOfBirth: "${values.dob._d.getTime()}") {
                            user {
                                id
                                firstName
                                lastName
                                email
                                dateOfBirth
                            }
                        }
                    }`;
                client
                    .mutate({
                        mutation: ADD_USER
                    })
                    .then(result => {
                        if (!result.error) {
                            const url = `http://${process.env.REACT_APP_GENETRUSTEE_IP}`;
                            const body = {
                                query: `
                                    mutation addMapping(
                                        $userId: String!
                                        $sampleId: String!
                                    ) {
                                        createMapping(
                                            userId: $userId
                                            genomeId: $sampleId
                                        ) {
                                            mapping {
                                                userId
                                                genomeId
                                            }
                                        }
                                    }
                                `,
                                variables: {
                                    userId: result.data.createUser.user.id,
                                    sampleId: values.sampleId
                                }
                            };
                            const config = {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            axios.post(url, body, config);
                            this.props.form.resetFields();
                        }
                    });
            }
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched
        } = this.props.form;

        const firstNameError =
            isFieldTouched("firstName") && getFieldError("firstName");
        const lastNameError =
            isFieldTouched("lastName") && getFieldError("lastName");
        const emailError = isFieldTouched("email") && getFieldError("email");
        const dateOfBirthError =
            isFieldTouched("dob") && getFieldDecorator("dob");
        return (
            <Content style={{ padding: "0 50px" }}>
                <div style={{ padding: 24, minHeight: 280 }}>
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <Form.Item
                            validateStatus={firstNameError ? "error" : ""}
                            help={firstNameError || ""}
                            label="First name"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("firstName", {
                                rules: [
                                    {
                                        required: true,
                                        message: "First name is required"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="solution" />}
                                    placeholder="First name"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={lastNameError ? "error" : ""}
                            help={lastNameError || ""}
                            label="Last name"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("lastName", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Last name is required"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="solution" />}
                                    placeholder="Last name"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={emailError ? "error" : ""}
                            help={emailError || ""}
                            label="Email"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("email", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Email is required"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="mail" />}
                                    placeholder="Email"
                                    type="email"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={""}
                            help={""}
                            label="Date of Birth"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("dob", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Date of birth is required"
                                    }
                                ]
                            })(<DatePicker placeholder="Select date" />)}
                        </Form.Item>
                        <Form.Item
                            validateStatus={""}
                            help={""}
                            label="Sample ID"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("sampleId", {
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            })(<Input placeholder="Sample ID" />)}
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                Add user
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        );
    }
}

const AddUserForm = Form.create({ name: "add_user" })(AddUser);
export default AddUserForm;
