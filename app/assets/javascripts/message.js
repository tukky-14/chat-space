$(function () {
  function buildHTML(message) {
    if (message.image) {
      var html = `<div class="main-list__box" data-message-id=${message.id}>
          <ul class="main-list__box__top">
            <li class="main-list__top__text__name">
            ${message.user_name}
            </li>
            <li class="main-list__top__text__time">
            ${message.created_at}
            </li>
          </ul>
          <p class="main-list__box__message">
          ${message.content}
          </p>
          <img src=${message.image}>
        </div>`;
      return html;
    } else {
      var html = `<div class="main-list__box" data-message-id=${message.id}>
            <ul class="main-list__box__top">
              <li class="main-list__top__text__name">
              ${message.user_name}
              </li>
              <li class="main-list__top__text__time">
              ${message.created_at}
              </li>
            </ul>
            <p class="main-list__box__message">
            ${message.content}
            </p>
          </div>`;
      return html;
    }
  }

  $("#new_message").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action");
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        var html = buildHTML(data);
        $(".main-list").append(html);
        $(".main-list").animate({ scrollTop: $(".main-list")[0].scrollHeight });
        $(".new_message")[0].reset();
        $(".main-form__box__send").removeAttr("disabled");
      })
      .fail(function () {
        alert("メッセージ送信に失敗しました");
      });
  });

  var reloadMessages = function () {
    var last_message_id = $(".main-list__box:last").data("message-id");
    $.ajax({
      url: "api/messages",
      type: "GET",
      dataType: "json",
      data: { id: last_message_id },
    })
      .done(function (messages) {
        if (messages.length !== 0) {
          var insertHTML = "";
          $.each(messages, function (i, message) {
            insertHTML += buildHTML(message);
          });
          $(".main-list").append(insertHTML);
          $(".main-list").animate({
            scrollTop: $(".main-list")[0].scrollHeight,
          });
        }
      })
      .fail(function () {
        alert("error");
      });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});
