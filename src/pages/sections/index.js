import { Checkbox, Collapse, Form, Input, Radio, Select } from "antd";

import React, { useEffect, useState } from "react";
import { data } from "./data";
const { Panel } = Collapse;
const { Option } = Select;

const getQuestion = (questions) => {
  const result = [];
  // 1. iterar por cada pregunta.

  questions.forEach((question) => {
    result.push(question);

    // 2. Si tiene modalCode buscar ese modalCode.
    const questionModal = data.form.modals.find(
      (q) => q.modalCode === question.code
    );

    // si no tiene ningun modal asociado, seguimos con la
    // proxima pregunta
    if (!questionModal) {
      return;
    }

    // 3. Comparar respuesas entre (answerOption, answerCheckOption) y modalValue.
    const showModal =
      questionModal.modalValue === question.answerOption ||
      question.answerCheckOption?.includes(questionModal.modalValue);

    // si no tengo que mostrar el modal, sigo
    // con la proxima pregunta
    if (!showModal) {
      return;
    }

    // 4.Agregar modalsQuestions
    const modalQuestions = getQuestion(questionModal.modalQuestions);

    result.push(...modalQuestions);
  });

  return result;
};

const sections = data.form.sections.reduce((acc, section) => {
  const sectionQuestions = data.form.questions.filter(
    (item) => item.sectionId === section.id
  );
  acc.push({
    sectionTitle: section.display,
    sectionId: section.id,
    questions: getQuestion(sectionQuestions),
  });

  return acc;
}, []);

// const AnswerComponent = {
//   TEXT: buildInput,
//   OPTIONS: buildRadio,
//   CHECK_OPTIONS: buildSelect,
//   DROPDOWN: buildCheckbox,
// };

const Sections = () => {
  const [form] = Form.useForm();
  const [responseModal, setResponseModal] = useState([]);

  const handleResponse = (id, value) => {
    const isDuplicate = responseModal.some((q) => q.id === id);

    if (!isDuplicate) {
      setResponseModal([...responseModal, { value, id }]);
    } else {
      const newArray = [...responseModal];
      const findResponse = newArray.find((item) => item.id === id);
      findResponse.value = value;
      setResponseModal(newArray);
    }
  };

  useEffect(() => {
    const sectionsQuestions = sections.flatMap((section) => section.questions);

    const arr = sectionsQuestions.map((question) => {
      return {
        id: question.id,
        value:
          question.answerText ||
          question.answerOption ||
          question.answerDetailsText ||
          question.answerNumber ||
          question.answerCheckOption,
      };
    });
    setResponseModal(arr);
  }, []);

  return (
    <Form form={form}>
      <Collapse accordion>
        {sections.map((section) => (
          <Panel header={section.sectionTitle}>
            {section.questions.map((q) => {
              const findValue = responseModal.find((r) => r.id === q.id)?.value;

              return (
                <Form.Item label={q.question}>
                  {q.answerType === "TEXT" && (
                    <Input
                      id={q.id}
                      onChange={(e) => handleResponse(q.id, e.target.value)}
                      value={findValue}
                    />
                  )}
                  {q.answerType === "CHECK_OPTIONS" && (
                    <Checkbox.Group
                      id={q.id}
                      onChange={(values) => handleResponse(q.id, values)}
                      value={findValue}
                    >
                      {q.options.map((o) => (
                        <Checkbox id={q.id} value={o.code}>
                          <span>{o.display}</span>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                  {q.answerType === "OPTIONS" && (
                    <Radio.Group
                      id={q.id}
                      aria-label={q.question || q.caption}
                      value={findValue}
                    >
                      {q.options.map((o) => (
                        <Radio
                          id={q.id}
                          aria-label={`${q.question || q.caption} - ${
                            o.display
                          }`.toLowerCase()}
                          value={o.code}
                          onChange={(e) => handleResponse(q.id, e.target.value)}
                        >
                          {o.display}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                  {q.answerType === "DROPDOWN" && (
                    <Select
                      value={findValue}
                      id={q.id}
                      onChange={(values) => handleResponse(q.id, values)}
                    >
                      {q.options.map((o) => (
                        <Option id={q.id} value={o.code}>
                          {o.display}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })}
          </Panel>
        ))}
      </Collapse>
    </Form>
  );
};

export default Sections;
