import { bindable, computedFrom } from 'aurelia-framework'

@bindable('user')
@bindable({
  name: 'large',
  defaultValue: false
})
@bindable({
  name: 'avatarOnly',
  attribute: 'avatar-only',
  defaultValue: false
})
export class UserDisplay {
  @computedFrom('large')
  get avatarStyle () {
    const size = this.large ? '48px' : '24px'
    return `height: ${size}; width: ${size}`
  }
}
