<template>
  <div
    class="loading"
    data-testid="loading"
  >
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
</template>

<style lang="scss" scoped>
.loading {
  --onboarding-loading: 130, 45, 197;

  display: flex;
  justify-content: space-between;
  width: 200px;

  > div {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      rgba(var(--onboarding-loading), 0.3) 0%,
      rgba(var(--onboarding-loading), 0.3) 107.42%
    );
    animation: loadingAnimation 0.5s infinite linear alternate;

    &:nth-of-type(2) {
      animation-delay: 0.25s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.5s;
    }
    &:nth-of-type(4) {
      animation-delay: 0.75s;
    }
    &:nth-of-type(5) {
      animation-delay: 1s;
    }
  }
}

@keyframes loadingAnimation {
  0%,
  50% {
    background: linear-gradient(
      90deg,
      rgba(var(--onboarding-loading), 0.3) 0%,
      rgba(var(--onboarding-loading), 0.3) 107.42%
    );
  }

  75% {
    background: linear-gradient(
      90deg,
      rgba(var(--onboarding-loading), 0.6) 0%,
      rgba(var(--onboarding-loading), 0.6) 107.42%
    );
  }

  100% {
    background: linear-gradient(90deg, rgba(var(--onboarding-loading), 1) 0%, rgba(var(--onboarding-loading), 1) 107.42%);
  }
}
</style>
