(function() {

  const TAG = 'aws-cli-help';
  const SETTINGS_KEY = `${TAG}-settings`;

  const getSites = () => {
    return {
      'console.aws.amazon.com/s3': {
        bucketsTitle: {
          itemSelector: '#buckets-table h3',
          attribSelector: '[data-testid="title"]',
          params: {},
          help: {
            intro: 'Operations in S3',
            examples: [
              {svc: 's3', cmd: 'ls', args: ''},
            ],
          },
        },
        buckets: {
          itemSelector: '#buckets-table table[role="table"] tbody tr',
          attribSelector: 'td a.bucket-name',
          params: {
            'bucket': {
              selectorText: 'td a.bucket-name',
            },
          },
          help: {
            intro: 'Operations on an S3 Bucket',
            examples: [
              {svc: 's3', cmd: 'ls', args: '<bucket>'},
              {svc: 's3', cmd: 'cp', args: 's3://<bucket>/<path> -'},
            ],
          },
        },
      },
      'console.aws.amazon.com/codesuite/codepipeline': {
        pipelineTitle: {
          itemSelector: '.dx-ViewPipeline .awsui-util-action-stripe-title-large',
          attribSelector: 'h1',
          params: {
            'pipeline': {
              selectorText: 'h1',
            },
          },
          help: {
            intro: 'Operations on this Pipeline',
            examples: [
              {svc: 'codepipeline', cmd: 'get-pipeline-state', args: '--name <pipeline>'},
            ],
          },
        },
        pipelines: {
          itemSelector: '#pipelines table[role="table"] tbody tr',
          attribSelector: 'td a[data-spec="PipelinesTable__nameColumn"]',
          params: {
            'pipeline': {
              selectorText: 'td a[data-spec="PipelinesTable__nameColumn"]',
            },
          },
          help: {
            intro: 'Operations on a Pipeline',
            examples: [
              {svc: 'codepipeline', cmd: 'get-pipeline-state', args: '--name <pipeline>'},
            ],
          },
        },
      },
      'console.aws.amazon.com/cloudformation': {
        stacks: {
          itemSelector: 'section[data-analytics="STACK_LIST"] tbody tr',
          attribSelector: 'td[class^="awsui_body"] a',
          params: {
            'stack': {
              selectorText: 'td[class^="awsui_body"] a',
            },
          },
          help: {
            intro: 'Operations on a CloudFormation Stack',
            examples: [
              {svc: 'cloudformation', cmd: 'describe-stacks', args: '--stack-name <stack>'},
              {svc: 'cloudformation', cmd: 'describe-stack-resources', args: '--stack-name <stack>'},
            ],
          },
        },
      },
      'console.aws.amazon.com/ec2': {
        instances: {
          // iframeSelector: '#compute-react-frame',
          itemSelector: '.instancesTable tbody tr',
          attribSelector: 'td[class^="awsui_body"] a[id^="link-self"]',
          params: {
            'id': {
              selectorText: 'td[class^="awsui_body"] a[id^="link-self"]',
            },
          },
          help: {
            intro: 'Operations on an EC2 Instance',
            examples: [
              {svc: 'ec2', cmd: 'describe-instances', args: '--instance-ids <id>'},
              {svc: 'ec2-instance-connect', cmd: 'send-ssh-public-key', args: '--instance-id <id> --instance-os-user root --ssh-public-key file://$HOME/.ssh/id_dsa.pub'},
            ],
          },
        },
        lbs: {
          // iframeSelector: '#elb_polaris-frame',
          itemSelector: '#elb-polaris-loadBalancers-table tbody tr',
          attribSelector: 'td[class^="awsui_body"] a',
          params: {
            'lbArn': {
              selectorLinkArn: 'td[class^="awsui_body"] a',
            },
          },
          help: {
            intro: 'Operations on a Load Balancer',
            examples: [
              {svc: 'elbv2', cmd: 'describe-target-groups', args: '--load-balancer-arn <lbArn>'},
            ],
          },
        },
      },
      'console.aws.amazon.com/lambda': {
        functions: {
          itemSelector: '#lambda-listFunctions tbody tr',
          attribSelector: 'td[class^="awsui_body"] a',
          params: {
            'name': {
              selectorText: 'td[class^="awsui_body"] a',
            },
          },
          help: {
            intro: 'Operations on a Lambda Function',
            examples: [
              {svc: 'lambda', cmd: 'invoke', args: '--function-name <name> --payload "{}"'},
              {svc: 'logs', cmd: 'tail', args: '--follow /aws/lambda/<name>'},
            ],
          },
        },
      },
      'console.aws.amazon.com/systems-manager/parameters': {
        functions: {
          itemSelector: 'tbody tr.awsui-table-row',
          attribSelector: 'td:nth-child(2) a',
          params: {
            'name': {
              selectorText: 'td:nth-child(2) a',
            },
          },
          help: {
            intro: 'Operations on a Parameter',
            examples: [
              {svc: 'ssm', cmd: 'get-parameter', args: '--name <name>'},
            ],
          },
        },
      },
    };
  };

  let iter = () => {
    let sitesData = getSites();
    for(let [urlMatch, site] of Object.entries(sitesData)) {
      if(window.location.href.indexOf(urlMatch) >= 0) {
        for(let [id, rule] of Object.entries(site)) {
          // console.debug(TAG, `Rule: ${urlMatch} -> ${id}`);
          doRule(id, rule);
        }
      }
    }
  };

  let doRule = (id, rule) => {
    let $root = $('body');
    // if(rule.iframeSelector) {
    //   let $contents = $(rule.iframeSelector).contents();
    //   $root = $contents.find('body');

    //   if($contents.find(`head link#${TAG}-css-self`).length == 0) {
    //     $contents.find('head').append(
    //       $('<link />')
    //         .attr('rel', 'stylesheet')
    //         .attr('href', chrome.runtime.getURL("style.css"))
    //         .attr('id', `${TAG}-css`)
    //     );
    //   }

    //   if($contents.find(`head script#${TAG}-js-jquery`).length == 0) {
    //     $contents.find('head').append(
    //       $('<script />')
    //         .attr('src', chrome.runtime.getURL("incl/jquery-3.7.1.min.js"))
    //         .attr('id', `${TAG}-js-jquery`)
    //     );
    //   }

    //   if($contents.find(`head link#${TAG}-css-tooltipster`).length == 0) {
    //     $contents.find('head').append(
    //       $('<link />')
    //         .attr('rel', 'stylesheet')
    //         .attr('href', chrome.runtime.getURL("incl/tooltipster.min.css"))
    //         .attr('id', `${TAG}-css-tooltipster`)
    //     );
    //   }

    //   if($contents.find(`head script#${TAG}-js-tooltipster`).length == 0) {
    //     $contents.find('head').append(
    //       $('<script />')
    //         .attr('src', chrome.runtime.getURL("incl/tooltipster.min.js"))
    //         .attr('id', `${TAG}-js-tooltipster`)
    //     );
    //   }
    // }
    // else {
    //   $root = $('body');
    // }

    $root.find(rule.itemSelector).each(function() {
      let $item = $(this);

      if($item.hasClass(`${TAG}-seen`)) return;
      else $item.addClass(`${TAG}-seen`);

      let $attrib = $item.find(rule.attribSelector).first();

      let params = parseParams($item, rule.params);

      // console.debug(TAG, {id, rule, $item, $attrib, params});

      let $launcher = $('<span/>')
        .text('›a')
        .attr('class', `${TAG} launcher`)
        .hide();

      $launcher.tooltipster({
          animation: 'grow',
          minWidth: 200,
          maxWidth: 800,
          interactive: true,
          interactiveTolerance: 2000,
          onlyOne: true,
          // position: 'top-right',
          content: buildHelpContent(rule.help, params),
          functionReady: (origin,tooltip) => {
            $attrib.data('helpHover', 'active');
          },
          functionAfter: (origin) => {
            $attrib.data('helpHover', 'nope');
            $launcher.hide();
          },
        });

      $attrib.parent().find(`.${TAG}.launcher`).remove();
      $attrib.after([$launcher]);

      $attrib
        .on('mouseenter', function() {
          $attrib.data(`${TAG}-enterDelay`, setTimeout(() => $launcher.show(), 500));
        })
        .on('mouseleave', function() {
          try {
            clearTimeout($attrib.data(`${TAG}-enterDelay`));
          } catch(err) {}
        })
        .parent()
          .on('mouseleave', function() {
            if($attrib.data('helpHover') !== 'active') {
              $launcher.hide();
            }
          });
    });
  }

  let buildHelpContent = (help, params) => {
    let ex = help.examples
      .map(e => {
        let sURL = `https://awscli.amazonaws.com/v2/documentation/api/latest/reference/${e.svc}/index.html`;
        let cURL = `https://awscli.amazonaws.com/v2/documentation/api/latest/reference/${e.svc}/${e.cmd}.html`;
        let html = `<div class="example">`;
        html    += `<span class="aws">aws</span> `;
        html    += `<span class="svc"><a href="${sURL}" target="_blank">${e.svc}</a></span> `;
        html    += `<span class="cmd"><a href="${cURL}" target="_blank">${e.cmd}</a></span> `;

        let ps = e.args.replaceAll(/<(.+?)>/g, (whole, placeholder) => {
          return params[placeholder] ? `<span class="param">${params[placeholder]}</span>` : placeholder;
        });

        html    += ps;
        html    += '</div>';
        return html;
      })
      .join("");

    let $content = $(`
      <div>
        <p class="intro">${help.intro || ''}</p>
        <div class="examples">${ex}</div>
      </div>
    `);

    return $content;
  }

  let parseParams = ($item, params) => {
    let kv = {};

    for(let [k, match] of Object.entries(params)) {
      if(match.selectorText) {
        let $el = $item.find(match.selectorText).first();
        kv[k] = $el.text().trim();
      }
      else if(match.selectorLinkArn) {
        let $el = $item.find(match.selectorLinkArn).first();
        let href = $el.attr('href');
        if(href) {
          kv[k] = href
            .replace(/.*(arn:aws:.*)/, '$1')
            .replace(/[;&%,].*/, '');
        }
      }
    }

    return kv;
  };

  chrome.storage.local.get([SETTINGS_KEY])
    .then((result) => {
      let raw = result[SETTINGS_KEY];
      let data = raw ? JSON.parse(raw) : {};
      let en = data.hasOwnProperty('enabledGlobal') ? data.enabledGlobal : true;
      if(en) {
        // console.debug(TAG, 'starting');
        setInterval(iter, 1000);        
      } else {
        // console.debug(TAG, 'disabled');
      }
    });

})();
