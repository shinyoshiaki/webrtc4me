# webrtc4me

# What is this?

This is a webrtc wrapper library for browser and node.js.  
Implemented very easy signaling way.  
Support multi label datachannel and media stream.

# How to use?

look `src/tests/`  `example/`

## vanilla ice

```typescript
  const peerOffer = new WebRTC();
  const peerAnswer = new WebRTC();

  peerOffer.makeOffer();
  const offer = await peerOffer.onSignal.asPromise();
  peerAnswer.setSdp(offer);
  const answer = await peerAnswer.onSignal.asPromise();
  peerOffer.setSdp(answer);

  await Promise.all([
    peerOffer.onConnect.asPromise(),
    peerAnswer.onConnect.asPromise()
  ]);
```

## trickle ice

```typescript
    const peerOffer = new WebRTC({ trickle: true });
    const peerAnswer = new WebRTC({ trickle: true });
      

    peerOffer.makeOffer();
    peerOffer.onSignal.subscribe(sdp => {
      peerAnswer.setSdp(sdp);
    });
    peerAnswer.onSignal.subscribe(sdp => {
      peerOffer.setSdp(sdp);
    });

    peerOffer.onConnect.once(() => {
        
    });

    peerAnswer.onConnect.once(() => {
        
    });
```

# example

<https://shinyoshiaki.github.io/webrtc4me/page>
