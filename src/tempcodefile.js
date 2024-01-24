const data = {
    "data": {
      "nextQuestionAnsweringAssignment": {
        "question": {
          "body": "<div><p>Let </p><code class=\"asciimath\">f_(n)</code><p> be a requence of measurable functions.t show that the set </p><code class=\"asciimath\">E={(x:f_(n)(x)):}</code><p> converges </p></div><div><img src=\"https://media.cheggcdn.com/study/e35/e35566c4-9b10-4e75-a77c-aa0c70e9c42a/image\" /></div>",
          "id": 131978661,
          "uuid": "c1e2ddd2-d186-4791-aabd-72a286b35a72",
          "subject": {
            "id": 33,
            "name": "Advanced Math",
            "subjectGroup": {
              "id": 10,
              "name": "Advanced Math",
              "__typename": "SubjectGroup"
            },
            "__typename": "Subject"
          },
          "imageTranscriptionText": "5. </span></span></span></span></span>.",
          "lastAnswerUuid": null,
          "questionTemplate": {
            "templateName": "QNA3_STUDENT_QUESTION",
            "templateId": 3,
            "__typename": "QuestionTemplate"
          },
          "__typename": "Question"
        },
        "langTranslation": null,
        "legacyAnswer": null,
        "questionGeoLocation": {
          "countryCode": null,
          "countryName": null,
          "languages": [
            "en",
            null,
            null
          ],
          "__typename": "QuestionGeoLocationTag"
        },
        "questionRoutingDetails": {
          "answeringStartTime": "Sun, 21 Jan 2024 17:10:39 GMT",
          "bonusCount": 0,
          "bonusTimeAllocationEnabled": true,
          "checkAnswerStructureEnabled": true,
          "hasAnsweringStarted": true,
          "questionAssignTime": "Sun, 21 Jan 2024 17:09:23 GMT",
          "questionSolvingProbability": 0.069333,
          "routingType": "SMART_ROUTING",
          "allocationExperimentId": 0,
          "questionQualityFactor": 2.1,
          "routingTag": null,
          "__typename": "QuestionRoutingInfo"
        },
        "__typename": "NextQuestionAnsweringAssignment"
      }
    }
  }

  console.log(data.data.nextQuestionAnsweringAssignment.question.id);