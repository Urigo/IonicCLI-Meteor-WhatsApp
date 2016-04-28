import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from '../entities';

export default class ChatNameFilter extends Filter {
  static $name = 'chatName'

  filter(chat) {
    if (!chat) return;

    let otherId = _.without(chat.userIds, Meteor.userId())[0];
    let otherUser = Meteor.users.findOne(otherId);
    let hasName = otherUser && otherUser.profile && otherUser.profile.name;

    return hasName ? otherUser.profile.name : chat.name || 'NO NAME';
  }
}