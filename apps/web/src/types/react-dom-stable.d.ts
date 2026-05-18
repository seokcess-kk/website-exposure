// react-dom 18.3.x: useFormState/useFormStatus 는 stable export 지만 @types/react-dom 18.3.7 가
// 이를 canary.d.ts 에만 두고 main index.d.ts 에서 re-export 안 함. ambient module 로 보강.

declare module "react-dom" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useFormState<State>(
    action: (state: Awaited<State>) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string,
  ): [state: Awaited<State>, dispatch: () => void];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useFormState<State, Payload>(
    action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string,
  ): [state: Awaited<State>, dispatch: (payload: Payload) => void];

  export function useFormStatus(): {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: ((formData: FormData) => void | Promise<void>) | string | null;
  };
}
