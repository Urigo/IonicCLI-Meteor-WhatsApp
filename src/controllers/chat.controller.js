import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import { _ } from 'meteor/underscore';
import { Chats, Messages } from 'api/collections';
import { Controller } from '../entities';

export default class ChatCtrl extends Controller {
  static $inject = ['$stateParams', '$timeout', '$ionicScrollDelegate']

  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();

    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      },
      data() {
        return Chats.findOne(this.chatId);
      }
    });
  }

  sendMessage() {
    if (_.isEmpty(this.message)) return;

    this.callMethod('newMessage', {
      text: this.message,
      chatId: this.chatId
    });

    delete this.message;
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.scrollBottom(true);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  closeKeyboard() {
    if (Keyboard) {
      Keyboard.close();
    }
  }

  scrollBottom(animate) {
    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
    }, 300);
  }
}